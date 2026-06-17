import { useEffect } from 'react';
import { useMotionValue, useReducedMotion, type MotionValue } from 'framer-motion';

import { useBotStore } from '@/src/features/bot/stores/bot.store';

interface UseAudioLevelOptions {
  enabled: boolean;
}

const NOISE_FLOOR = 0.02;
const MAX_RMS = 0.28;
const SMOOTHING = 0.45;

type WindowWithWebkitAudio = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

// ¿Existe reconocimiento de voz nativo? En desktop sí (Chrome/Safari) y el
// micrófono nativo no expone un MediaStream reutilizable, así que el medidor abre
// el suyo. En móvil (iOS) NO existe → se usa Whisper, que comparte su stream; ahí
// esperamos ese stream en vez de abrir un segundo getUserMedia.
const hasNativeSpeech = (): boolean => {
  if (typeof window === 'undefined') return false;
  const w = window as Window &
    typeof globalThis & {
      SpeechRecognition?: unknown;
      webkitSpeechRecognition?: unknown;
    };
  return Boolean(w.SpeechRecognition ?? w.webkitSpeechRecognition);
};

const useAudioLevel = ({ enabled }: UseAudioLevelOptions): MotionValue<number> => {
  const level = useMotionValue(0);
  const reduce = useReducedMotion();
  // Stream de micrófono ya abierto por useSpeechRecognition (camino Whisper/móvil).
  // Si existe lo reutilizamos para no abrir un segundo getUserMedia — en iOS dos
  // streams simultáneos generan contención y jank.
  const sharedStream = useBotStore((s) => s.micStream);

  useEffect(() => {
    if (!enabled || reduce) {
      level.set(0);
      return;
    }
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return;
    }

    let cancelled = false;
    let rafId: number | null = null;
    let stream: MediaStream | null = null;
    // Sólo detenemos los tracks si abrimos el stream nosotros (desktop/nativo).
    // Si reutilizamos el compartido, su dueño es useSpeechRecognition.
    let ownsStream = false;
    let audioCtx: AudioContext | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let analyser: AnalyserNode | null = null;
    let smoothed = 0;

    const start = async () => {
      try {
        let mediaStream: MediaStream;
        if (sharedStream) {
          mediaStream = sharedStream;
        } else if (hasNativeSpeech()) {
          // Desktop: el reconocimiento nativo no comparte stream → abrimos el propio.
          mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          ownsStream = true;
        } else {
          // Móvil: esperar el stream compartido por Whisper (el efecto se re-ejecuta
          // cuando `sharedStream` cambia) en lugar de abrir un segundo micrófono.
          return;
        }
        if (cancelled) {
          if (ownsStream) mediaStream.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = mediaStream;
        const Ctor = window.AudioContext ?? (window as WindowWithWebkitAudio).webkitAudioContext;
        if (!Ctor) return;
        audioCtx = new Ctor();
        // iOS crea el AudioContext suspendido; reanudar para que el análisis corra.
        audioCtx.resume?.().catch(() => undefined);
        source = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.5;
        source.connect(analyser);

        const buffer = new Uint8Array(analyser.fftSize);
        const tick = () => {
          if (!analyser) return;
          analyser.getByteTimeDomainData(buffer);
          let sumSquares = 0;
          for (let i = 0; i < buffer.length; i += 1) {
            const v = (buffer[i] - 128) / 128;
            sumSquares += v * v;
          }
          const rms = Math.sqrt(sumSquares / buffer.length);
          const normalized = Math.min(1, Math.max(0, (rms - NOISE_FLOOR) / (MAX_RMS - NOISE_FLOOR)));
          smoothed = smoothed * SMOOTHING + normalized * (1 - SMOOTHING);
          level.set(smoothed);
          rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
      } catch {
        // permission denied or device error — leave level at 0
      }
    };

    start();

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      source?.disconnect();
      analyser?.disconnect();
      audioCtx?.close().catch(() => undefined);
      if (ownsStream) stream?.getTracks().forEach((t) => t.stop());
      level.set(0);
    };
  }, [enabled, reduce, level, sharedStream]);

  return level;
};

export { useAudioLevel };
