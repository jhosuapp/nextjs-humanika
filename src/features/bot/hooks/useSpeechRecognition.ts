import { useCallback, useEffect, useRef, useState } from 'react';

import { useBotStore } from '@/src/features/bot/stores/bot.store';

type SpeechResultCallback = (transcript: string, isFinal: boolean) => void;

interface UseSpeechRecognitionResult {
  start: () => Promise<void>;
  stop: () => void;
  isListening: boolean;
  error: string | null;
  engine: 'native' | 'whisper' | null;
}

interface UseSpeechRecognitionOptions {
  locale?: string;
  onResult?: SpeechResultCallback;
}

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type WindowWithSpeech = Window &
  typeof globalThis & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };

type WindowWithWebkitAudio = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

const getNativeRecognitionCtor = (): (new () => SpeechRecognitionLike) | null => {
  if (typeof window === 'undefined') return null;
  const w = window as WindowWithSpeech;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

// Fallback de corte por tiempo cuando WebAudio (VAD) no está disponible.
const WHISPER_CHUNK_MS = 4000;
// Detección de silencio (VAD): se corta la grabación cuando el usuario deja de
// hablar, para enviar a Whisper de inmediato en lugar de esperar bloques fijos.
const SILENCE_MS = 900; // silencio sostenido que cierra el turno
const VAD_NOISE_FLOOR = 0.025; // RMS por debajo del cual se considera silencio
const MIN_SPEECH_MS = 300; // duración mínima antes de poder cortar
const MAX_UTTERANCE_MS = 12000; // tope de seguridad por turno

const useSpeechRecognition = ({
  locale = 'es',
  onResult,
}: UseSpeechRecognitionOptions): UseSpeechRecognitionResult => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [engine, setEngine] = useState<'native' | 'whisper' | null>(null);
  const setSpeechEngine = useBotStore((s) => s.setSpeechEngine);
  const setMicStream = useBotStore((s) => s.setMicStream);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const vadRafRef = useRef<number | null>(null);
  const vadCtxRef = useRef<AudioContext | null>(null);
  const onResultRef = useRef<SpeechResultCallback | undefined>(onResult);
  const localeRef = useRef(locale);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  const cleanupStream = useCallback(() => {
    if (vadRafRef.current !== null) {
      cancelAnimationFrame(vadRafRef.current);
      vadRafRef.current = null;
    }
    if (vadCtxRef.current) {
      vadCtxRef.current.close().catch(() => undefined);
      vadCtxRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setMicStream(null);
  }, [setMicStream]);

  const stop = useCallback(() => {
    const rec = recognitionRef.current;
    if (rec) {
      // Detach handlers BEFORE abort() so the onend auto-restart doesn't fire
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      rec.abort();
    }
    recognitionRef.current = null;
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    cleanupStream();
    setIsListening(false);
  }, [cleanupStream]);

  const startWhisper = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('speech_not_supported');
      return;
    }
    setEngine('whisper');
    setSpeechEngine('whisper');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        // Cancelación de eco/ruido: evita que el micrófono capte el audio del
        // propio bot que sale por los parlantes (auto-escucha / bucle).
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      // Compartir el stream para que useAudioLevel no abra un segundo micrófono.
      setMicStream(stream);

      // Analizador para VAD (detección de silencio). Si WebAudio no está, se cae
      // al corte por tiempo fijo más abajo.
      const AudioCtor =
        window.AudioContext ?? (window as WindowWithWebkitAudio).webkitAudioContext;
      let analyser: AnalyserNode | null = null;
      let vadBuffer: Uint8Array<ArrayBuffer> | null = null;
      if (AudioCtor) {
        const ctx = new AudioCtor();
        vadCtxRef.current = ctx;
        ctx.resume?.().catch(() => undefined);
        const src = ctx.createMediaStreamSource(stream);
        analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);
        vadBuffer = new Uint8Array(new ArrayBuffer(analyser.fftSize));
      }

      const sendBlob = async (blob: Blob) => {
        if (blob.size === 0) return;
        try {
          const form = new FormData();
          form.append('audio', blob, 'speech.webm');
          form.append('locale', localeRef.current);
          const res = await fetch('/api/transcribe', { method: 'POST', body: form });
          if (!res.ok) throw new Error(`transcribe_${res.status}`);
          const data = (await res.json()) as { text?: string };
          if (data.text) {
            console.log('[mic] whisper:', data.text);
            onResultRef.current?.(data.text, true);
          }
        } catch (e) {
          setError(e instanceof Error ? e.message : 'transcribe_failed');
        }
      };

      // Cada turno usa un MediaRecorder que se detiene por silencio (VAD) o por
      // tope de seguridad; envía su blob y arranca el siguiente turno.
      const startCycle = () => {
        if (!streamRef.current) return;
        const recorder = new MediaRecorder(streamRef.current);
        mediaRecorderRef.current = recorder;
        const chunks: BlobPart[] = [];
        const startedAt = Date.now();
        let hasSpoken = false;
        let lastVoiceTs = startedAt;
        let stopped = false;

        const stopRecorder = () => {
          if (stopped) return;
          stopped = true;
          if (vadRafRef.current !== null) {
            cancelAnimationFrame(vadRafRef.current);
            vadRafRef.current = null;
          }
          if (recorder.state === 'recording') recorder.stop();
        };

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
          chunks.length = 0;
          // Reagendar el siguiente turno YA (antes de la red) para que el micrófono
          // no quede en un hueco mientras se transcribe. Sólo si seguimos siendo el
          // recorder activo (en stop() externo, mediaRecorderRef.current ya es null).
          if (mediaRecorderRef.current === recorder && streamRef.current) {
            startCycle();
          }
          // Sólo se envía si hubo voz (evita mandar silencio puro a Whisper).
          if (hasSpoken) void sendBlob(blob);
        };

        recorder.start();

        if (analyser && vadBuffer) {
          const tick = () => {
            if (stopped || !analyser || !vadBuffer) return;
            analyser.getByteTimeDomainData(vadBuffer);
            let sum = 0;
            for (let i = 0; i < vadBuffer.length; i += 1) {
              const v = (vadBuffer[i] - 128) / 128;
              sum += v * v;
            }
            const rms = Math.sqrt(sum / vadBuffer.length);
            const now = Date.now();
            if (rms > VAD_NOISE_FLOOR) {
              hasSpoken = true;
              lastVoiceTs = now;
            }
            const elapsed = now - startedAt;
            const silenceFor = now - lastVoiceTs;
            if (hasSpoken && silenceFor > SILENCE_MS && elapsed > MIN_SPEECH_MS) {
              stopRecorder();
              return;
            }
            if (elapsed > MAX_UTTERANCE_MS) {
              stopRecorder();
              return;
            }
            vadRafRef.current = requestAnimationFrame(tick);
          };
          vadRafRef.current = requestAnimationFrame(tick);
        } else {
          // Sin WebAudio: corte por tiempo fijo (comportamiento anterior).
          hasSpoken = true;
          setTimeout(stopRecorder, WHISPER_CHUNK_MS);
        }
      };

      startCycle();
      setIsListening(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'mic_failed');
      cleanupStream();
    }
  }, [cleanupStream, setMicStream, setSpeechEngine]);

  const startNative = useCallback((Ctor: new () => SpeechRecognitionLike) => {
    setEngine('native');
    setSpeechEngine('native');
    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = localeRef.current;
    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) final += transcript;
        else interim += transcript;
      }
      if (final) {
        console.log('[mic] final:', final);
        onResultRef.current?.(final, true);
      } else if (interim) {
        console.log('[mic] interim:', interim);
        onResultRef.current?.(interim, false);
      }
    };
    recognition.onerror = (e) => {
      setError(e.error);
      if (e.error === 'no-speech' || e.error === 'audio-capture') {
        // try restart silently
        return;
      }
      setIsListening(false);
    };
    recognition.onend = () => {
      // Native recognition stops on its own; restart if we're still meant to listen
      if (recognitionRef.current === recognition) {
        try {
          recognition.start();
        } catch {
          setIsListening(false);
        }
      }
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'recognition_failed');
    }
  }, [setSpeechEngine]);

  const start = useCallback(async () => {
    setError(null);
    const Ctor = getNativeRecognitionCtor();
    if (Ctor) {
      startNative(Ctor);
    } else {
      await startWhisper();
    }
  }, [startNative, startWhisper]);

  useEffect(() => stop, [stop]);

  return { start, stop, isListening, error, engine };
};

export { useSpeechRecognition };
