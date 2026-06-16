import { useCallback, useEffect, useRef } from "react";

import {
  MIN_INPUT_WORDS,
  STATUS_KEYS,
  VIDEOS,
  type StatusKey,
} from "@/src/features/bot/data/bot-content";
import { requestBotResponse } from "@/src/features/bot/actions/request-bot-response.action";
import { useBotStore } from "@/src/features/bot/stores/bot.store";
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

const useBotEngine = ({ locale }: UseBotEngineOptions) => {
  const state = useBotStore((s) => s.state);
  const setState = useBotStore((s) => s.setState);
  const setStatusKey = useBotStore((s) => s.setStatusKey);
  const setLastInput = useBotStore((s) => s.setLastInput);
  const setError = useBotStore((s) => s.setError);
  const setBotVideo = useBotStore((s) => s.setVideo);
  const resetStore = useBotStore((s) => s.reset);
  const micPermission = useBotStore((s) => s.micPermission);

  const pushMessage = useChatStore((s) => s.push);
  const clearChat = useChatStore((s) => s.clear);
  const consumeUserInput = useChatStore((s) => s.consumeUserInput);
  const pendingUserInput = useChatStore((s) => s.pendingUserInput);
  const setLastScriptId = useChatStore((s) => s.setLastScriptId);

  const videoPlayer = useVideoPlayer();
  const stateRef = useRef(state);
  const statusIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const listeningSinceRef = useRef(0);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    return () => {
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
        setStatusKey(null);
        setLastScriptId(response.scriptId ?? null);
        pushMessage({ role: "bot", text: response.text });
        setBotVideo(response.videoUrl, { loop: false, muted: false });
        setState("RESPONDING");
        await videoPlayer.play(response.videoUrl, {
          loop: false,
          muted: false,
          onEnded: () => {
            if (stateRef.current === "RESPONDING") {
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
      setBotVideo,
      setLastInput,
      setLastScriptId,
      setState,
      setStatusKey,
      transitionToError,
      videoPlayer,
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

  const start = useCallback(() => {
    if (stateRef.current === "IDLE") {
      setState("INTRO");
    }
  }, [setState]);

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
    speech.stop();
    clearChat();
    setError(null);
    resetStore();
    setState(micPermission === "granted" ? "IDLE" : "PERMISSION_PENDING");
  }, [clearChat, micPermission, resetStore, setError, setState, speech]);

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
    if (state === "PERMISSION_PENDING" && micPermission === "granted") {
      setState("IDLE");
    }
  }, [micPermission, setState, state]);

  useEffect(() => {
    inactivity.reset();
    if (state !== "THINKING" && statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
      statusIntervalRef.current = null;
      setStatusKey(null);
    }
    // El micrófono solo escucha en LISTENING (el bot esperando al usuario, o tras
    // pulsar el botón para interrumpir). En cualquier otro estado se apaga.
    if (state === "LISTENING") {
      if (!speech.isListening) speech.start().catch(() => undefined);
    } else if (speech.isListening) {
      speech.stop();
    }
    switch (state) {
      case "IDLE": {
        setBotVideo(VIDEOS.defaultWait, { loop: true, muted: true });
        videoPlayer.play(VIDEOS.defaultWait, { loop: true, muted: true });
        break;
      }
      case "INTRO": {
        setBotVideo(VIDEOS.intro, { loop: false, muted: false });
        videoPlayer.play(VIDEOS.intro, {
          loop: false,
          muted: false,
          onEnded: () => {
            if (stateRef.current === "INTRO") setState("LISTENING");
          },
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
    inactivity,
  };
};

export { useBotEngine };
