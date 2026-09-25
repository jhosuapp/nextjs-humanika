import { useCallback, useEffect, useRef } from "react";

import {
  CLOSING_SCRIPT_ID,
  MIC_RELEASE_MS,
  MIN_INPUT_WORDS,
  STATUS_KEYS,
  VIDEOS,
  type StatusKey,
} from "@/src/features/bot/data/bot-content";
import { requestBotResponse } from "@/src/features/bot/actions/request-bot-response.action";
import { useBotStore, type BotState } from "@/src/features/bot/stores/bot.store";
import { useChatStore } from "@/src/features/bot/stores/chat.store";
import { useInactivityTimer } from "@/src/features/bot/hooks/useInactivityTimer";
import { useSpeechRecognition } from "@/src/features/bot/hooks/useSpeechRecognition";
import { useVideoPlayer } from "@/src/features/bot/hooks/useVideoPlayer";

interface UseBotEngineOptions {
  locale: string;
}

// Al entrar a LISTENING (el bot acaba de callar), se ignora la voz captada
// durante este lapso para no tomar como pregunta la cola de audio del propio bot.
const LISTENING_GRACE_MS = 500;

// Cuántos mensajes recientes (usuario+bot) se envían como contexto al clasificador.
const HISTORY_TURNS = 6;

// Estados en los que el avatar está hablando y, por tanto, se le puede cortar.
const SPEAKING_STATES: ReadonlySet<BotState> = new Set<BotState>(["INTRO", "RESPONDING"]);

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const useBotEngine = ({ locale }: UseBotEngineOptions) => {
  const state = useBotStore((s) => s.state);
  const setState = useBotStore((s) => s.setState);
  const setStatusKey = useBotStore((s) => s.setStatusKey);
  const setLastInput = useBotStore((s) => s.setLastInput);
  const setError = useBotStore((s) => s.setError);
  const setBotVideo = useBotStore((s) => s.setVideo);
  const resetStore = useBotStore((s) => s.reset);
  const micPermission = useBotStore((s) => s.micPermission);
  const setMicPermission = useBotStore((s) => s.setMicPermission);

  const pushMessage = useChatStore((s) => s.push);
  const clearChat = useChatStore((s) => s.clear);
  const consumeUserInput = useChatStore((s) => s.consumeUserInput);
  const pendingUserInput = useChatStore((s) => s.pendingUserInput);
  const setLastScriptId = useChatStore((s) => s.setLastScriptId);

  const videoPlayer = useVideoPlayer();
  const stateRef = useRef(state);
  const statusIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const listeningSinceRef = useRef(0);
  // reset() se declara después de sendToBackend, pero el onEnded del video de
  // despedida necesita invocarlo; un ref siempre apunta a la versión más reciente.
  const resetRef = useRef<() => void>(() => {});
  // Cuándo quedó cerrado el micrófono por última vez (ver MIC_RELEASE_MS) y la
  // promesa que se resuelve cuando el navegador lo suelta de verdad.
  const micReleasedAtRef = useRef(0);
  const micClosedRef = useRef<Promise<unknown>>(Promise.resolve());
  // `speech` se crea después de sendToBackend (depende de él): se accede por ref.
  const speechStopRef = useRef<() => Promise<void> | void>(() => undefined);
  // false tras desmontar: una respuesta que llega después no debe tocar el store.
  const mountedRef = useRef(true);

  const closeMic = useCallback(() => {
    const closing = Promise.resolve(speechStopRef.current()).then(() => {
      micReleasedAtRef.current = Date.now();
    });
    // Si ya se estaba cerrando, hay que esperar a ambos.
    micClosedRef.current = Promise.all([micClosedRef.current, closing]);
  }, []);

  // Llamar ANTES de salir de LISTENING, para que la espera empiece ya y no
  // cuando corra el efecto de estado.
  const releaseMic = useCallback(() => {
    if (stateRef.current === "LISTENING") closeMic();
  }, [closeMic]);

  // Un clip con sonido no arranca hasta que el micrófono está cerrado y el audio
  // del sistema se ha estabilizado: con audífonos Bluetooth, abrir el micrófono
  // los pasa a «modo llamada» y volver al modo normal tarda en completarse.
  const waitForMicRelease = useCallback(async () => {
    await micClosedRef.current;
    const remaining = micReleasedAtRef.current + MIC_RELEASE_MS - Date.now();
    if (remaining > 0) await sleep(remaining);
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
        statusIntervalRef.current = null;
      }
      // On unmount during THINKING, the in-flight request becomes orphaned — recover to a stable state.
      const store = useBotStore.getState();
      if (store.state === "THINKING") {
        store.setStatusKey(null);
        store.setState(
          store.micPermission === "granted" ? "IDLE" : "PERMISSION_PENDING",
        );
      }
    };
  }, []);

  const transitionToError = useCallback(
    (message: string) => {
      setError(message);
      setState("ERROR");
    },
    [setError, setState],
  );

  const sendToBackend = useCallback(
    async (input: string) => {
      pushMessage({ role: "user", text: input });
      setLastInput(input);
      releaseMic();
      setState("THINKING");

      let idx = 0;
      setStatusKey(STATUS_KEYS[0]);
      if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);
      statusIntervalRef.current = setInterval(() => {
        idx = (idx + 1) % STATUS_KEYS.length;
        setStatusKey(STATUS_KEYS[idx] as StatusKey);
      }, 2000);

      try {
        const chat = useChatStore.getState();
        const previousScriptId = chat.lastScriptId;
        // Historial reciente para dar contexto al clasificador. El último mensaje
        // es el input actual (ya recién empujado), así que se excluye.
        const history = chat.messages
          .slice(0, -1)
          .slice(-HISTORY_TURNS)
          .map((m) => ({ role: m.role, text: m.text }));
        const response = await requestBotResponse({
          input,
          locale,
          previousScriptId,
          history,
        });
        if (statusIntervalRef.current) {
          clearInterval(statusIntervalRef.current);
          statusIntervalRef.current = null;
        }
        // Si la respuesta llega muy rápido, el micrófono aún se está cerrando.
        await waitForMicRelease();
        // reset() o desmontaje durante la espera.
        if (!mountedRef.current || stateRef.current !== "THINKING") return;
        setStatusKey(null);
        setLastScriptId(response.scriptId ?? null);
        pushMessage({ role: "bot", text: response.text });
        setBotVideo(response.videoUrl, { loop: false, muted: false });
        setState("RESPONDING");
        await videoPlayer.play(response.videoUrl, {
          loop: false,
          muted: false,
          onEnded: () => {
            if (stateRef.current !== "RESPONDING") return;
            // Despedida: al terminar el video de cierre, dejar de escuchar y
            // reiniciar la conversación (volver a la pantalla inicial).
            if (response.scriptId === CLOSING_SCRIPT_ID) {
              resetRef.current();
            } else {
              setState("LISTENING");
            }
          },
        });
      } catch (e) {
        if (statusIntervalRef.current) {
          clearInterval(statusIntervalRef.current);
          statusIntervalRef.current = null;
        }
        transitionToError(e instanceof Error ? e.message : "request_failed");
      }
    },
    [
      locale,
      pushMessage,
      releaseMic,
      setBotVideo,
      setLastInput,
      setLastScriptId,
      setState,
      setStatusKey,
      transitionToError,
      videoPlayer,
      waitForMicRelease,
    ],
  );

  // El micrófono solo corre en LISTENING, así que el resultado se interpreta
  // siempre como una pregunta del usuario. Se ignora la cola de audio del bot
  // (gracia inicial) y los resultados que lleguen fuera de LISTENING.
  const handleSpeechResult = useCallback(
    (transcript: string, isFinal: boolean) => {
      console.log(
        `[mic] estado=${stateRef.current} final=${isFinal} →`,
        JSON.stringify(transcript),
      );
      if (!isFinal) return;
      if (stateRef.current !== "LISTENING") return;
      if (Date.now() - listeningSinceRef.current < LISTENING_GRACE_MS) return;
      const text = transcript.trim();
      if (text.split(/\s+/).filter(Boolean).length < MIN_INPUT_WORDS) return;
      sendToBackend(text);
    },
    [sendToBackend],
  );

  const speech = useSpeechRecognition({ locale, onResult: handleSpeechResult });

  useEffect(() => {
    speechStopRef.current = speech.stop;
  }, [speech.stop]);

  const start = useCallback(() => {
    if (stateRef.current === "IDLE") {
      // Se invoca desde el onClick del botón → estamos dentro del gesto de usuario.
      // Desbloqueamos ambos slots de video AQUÍ (síncrono) para que las respuestas
      // posteriores (que reproducen tras un await de red) emitan audio en iOS.
      videoPlayer.unlock();
      setState("INTRO");
    }
  }, [setState, videoPlayer]);

  /**
   * Corta al avatar y devuelve el turno a la persona. El clip se calla ANTES de
   * pasar a LISTENING (que abre el micrófono): abrirlo con el avatar sonando
   * cambia de modo los audífonos Bluetooth a mitad de la frase.
   */
  const interrupt = useCallback(() => {
    if (SPEAKING_STATES.has(stateRef.current)) videoPlayer.stop();
    else if (stateRef.current !== "THINKING") return;
    setState("LISTENING");
  }, [setState, videoPlayer]);

  const submitText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      sendToBackend(trimmed);
    },
    [sendToBackend],
  );

  const reset = useCallback(() => {
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
      statusIntervalRef.current = null;
    }
    closeMic();
    clearChat();
    setError(null);
    resetStore();
    setState(micPermission === "denied" ? "PERMISSION_PENDING" : "IDLE");
  }, [clearChat, closeMic, micPermission, resetStore, setError, setState]);

  useEffect(() => {
    resetRef.current = reset;
  }, [reset]);

  const inactivity = useInactivityTimer({
    enabled: state !== "PERMISSION_PENDING" && state !== "ERROR",
    onTimeout: () => {
      reset();
    },
  });

  useEffect(() => {
    if (pendingUserInput === null) return;
    if (state === "THINKING") return;
    const text = consumeUserInput();
    if (text) submitText(text);
  }, [consumeUserInput, pendingUserInput, state, submitText]);

  useEffect(() => {
    // El permiso del micrófono no se pide al entrar: el saludo no lo necesita y
    // abrir el micrófono justo cuando arranca cambia de modo los audífonos
    // Bluetooth (el saludo se queda mudo, se traba y repite). Se pide al abrirlo
    // por primera vez, al terminar el saludo. Sólo un rechazo detiene al bot.
    if (state === "PERMISSION_PENDING" && micPermission !== "denied") {
      setState("IDLE");
    }
  }, [micPermission, setState, state]);

  // El navegador rechazó el micrófono al pedirlo tras el saludo.
  useEffect(() => {
    if (speech.error !== "not-allowed" && speech.error !== "service-not-allowed") return;
    setMicPermission("denied");
    if (stateRef.current === "LISTENING") setState("PERMISSION_PENDING");
  }, [setMicPermission, setState, speech.error]);

  useEffect(() => {
    inactivity.reset();
    if (state !== "THINKING" && statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
      statusIntervalRef.current = null;
      setStatusKey(null);
    }
    if (state === "LISTENING" && useBotStore.getState().micPermission === "denied") {
      setState("PERMISSION_PENDING");
      return;
    }
    // El micrófono solo escucha en LISTENING (el bot esperando al usuario, o tras
    // pulsar el botón para interrumpir). En cualquier otro estado se apaga.
    if (state === "LISTENING") {
      if (!speech.isListening) speech.start().catch(() => undefined);
    } else if (speech.isListening) {
      closeMic();
    }
    switch (state) {
      case "IDLE": {
        setBotVideo(VIDEOS.defaultWait, { loop: true, muted: true });
        videoPlayer.play(VIDEOS.defaultWait, { loop: true, muted: true });
        break;
      }
      case "INTRO": {
        setBotVideo(VIDEOS.intro, { loop: false, muted: false });
        // Si se acaba de cerrar el micrófono (reset y volver a empezar), el
        // saludo espera a que el audio se estabilice como cualquier respuesta.
        void waitForMicRelease().then(() => {
          if (!mountedRef.current || stateRef.current !== "INTRO") return;
          videoPlayer.play(VIDEOS.intro, {
            loop: false,
            muted: false,
            onEnded: () => {
              if (stateRef.current === "INTRO") setState("LISTENING");
            },
          });
        });
        break;
      }
      case "LISTENING": {
        listeningSinceRef.current = Date.now();
        setBotVideo(VIDEOS.defaultWait, { loop: true, muted: true });
        videoPlayer.play(VIDEOS.defaultWait, { loop: true, muted: true });
        break;
      }
      case "THINKING": {
        setBotVideo(VIDEOS.defaultWait, { loop: true, muted: true });
        videoPlayer.play(VIDEOS.defaultWait, { loop: true, muted: true });
        break;
      }
      case "RESPONDING": {
        break;
      }
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return {
    state,
    micPermission,
    videoPlayer,
    speech,
    start,
    submitText,
    reset,
    interrupt,
    inactivity,
  };
};

export { useBotEngine };
