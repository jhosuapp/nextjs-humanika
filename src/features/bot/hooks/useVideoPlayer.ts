import { useCallback, useEffect, useRef, useState } from 'react';

import { VIDEOS } from '@/src/features/bot/data/bot-content';

// Límite de volumen base para TODOS los videos (intro, respuestas…): nunca suenan
// al 100% para que la voz del bot no se cruce con la del usuario. El ducking por
// voz baja aún más este valor de forma puntual.
const BASE_VIDEO_VOLUME = 0.6;

// Un clip con sonido entra subiendo el volumen en este tiempo, en lugar de
// arrancar de golpe (evita el «golpe» de audio al cambiar de clip).
const AUDIO_FADE_IN_MS = 250;

// Se espera a tener datos para reproducir sin trabarse; si el navegador no
// avisa en este tiempo, se reproduce igual.
const READY_TIMEOUT_MS = 1500;

// Duración del crossfade de opacidad entre slots (ver video-stage.module.css).
const CROSSFADE_MS = 550;

// HTMLMediaElement.HAVE_FUTURE_DATA
const HAVE_FUTURE_DATA = 3;

const waitForReady = (el: HTMLVideoElement): Promise<void> =>
  new Promise((resolve) => {
    if (el.readyState >= HAVE_FUTURE_DATA) {
      resolve();
      return;
    }
    const done = () => {
      el.removeEventListener('canplay', done);
      el.removeEventListener('error', done);
      window.clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(done, READY_TIMEOUT_MS);
    el.addEventListener('canplay', done);
    el.addEventListener('error', done);
  });

type Slot = 'A' | 'B';

interface PlayOptions {
  loop?: boolean;
  muted?: boolean;
  onEnded?: () => void;
}

interface UseVideoPlayerResult {
  refA: React.RefObject<HTMLVideoElement | null>;
  refB: React.RefObject<HTMLVideoElement | null>;
  active: Slot;
  play: (src: string, opts?: PlayOptions) => Promise<void>;
  /** Calla el clip en curso de inmediato (interrumpir al avatar). */
  stop: () => void;
  /**
   * Desbloquea AMBOS elementos <video> para reproducción con audio en iOS.
   * iOS sólo permite audio en un elemento cuyo play() ocurrió dentro de un gesto
   * de usuario, y el desbloqueo es por elemento. Debe llamarse SÍNCRONAMENTE
   * dentro del handler del gesto (p. ej. el onClick del botón de inicio).
   */
  unlock: () => void;
  /** Devuelve el `src` del video que se está reproduciendo en el slot activo (o null). */
  getActiveSrc: () => string | null;
}

const useVideoPlayer = (): UseVideoPlayerResult => {
  const refA = useRef<HTMLVideoElement | null>(null);
  const refB = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState<Slot>('A');
  const activeRef = useRef<Slot>('A');
  const onEndedRef = useRef<(() => void) | null>(null);
  const currentSrcRef = useRef<{ A: string | null; B: string | null }>({
    A: null,
    B: null,
  });
  // Cada play() se numera: si llega otro mientras el anterior espera a cargar,
  // el anterior se descarta.
  const playTokenRef = useRef(0);
  const fadeRafRef = useRef<number | null>(null);

  const stopFade = useCallback(() => {
    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }
  }, []);

  const fadeIn = useCallback(
    (el: HTMLVideoElement) => {
      stopFade();
      const startedAt = performance.now();
      const step = (now: number) => {
        // `now` es el instante en que empezó ESTE frame, que puede ser anterior
        // al performance.now() de arriba: sin el max(0) el progreso sale
        // negativo y asignar un volumen negativo lanza IndexSizeError.
        const elapsed = Math.max(0, now - startedAt);
        const progress = Math.min(1, elapsed / AUDIO_FADE_IN_MS);
        el.volume = BASE_VIDEO_VOLUME * progress;
        fadeRafRef.current = progress < 1 ? requestAnimationFrame(step) : null;
      };
      fadeRafRef.current = requestAnimationFrame(step);
    },
    [stopFade],
  );

  useEffect(() => stopFade, [stopFade]);

  const getRef = useCallback(
    (slot: Slot) => (slot === 'A' ? refA.current : refB.current),
    [],
  );

  useEffect(() => {
    const a = refA.current;
    const b = refB.current;
    const fire = (slot: Slot) => () => {
      if (slot === activeRef.current) onEndedRef.current?.();
    };
    const onEndedA = fire('A');
    const onEndedB = fire('B');
    a?.addEventListener('ended', onEndedA);
    b?.addEventListener('ended', onEndedB);
    return () => {
      a?.removeEventListener('ended', onEndedA);
      b?.removeEventListener('ended', onEndedB);
    };
  }, []);

  const play = useCallback(
    async (src: string, opts: PlayOptions = {}): Promise<void> => {
      const currentActive = activeRef.current;
      const sameSrcOnActive = currentSrcRef.current[currentActive] === src;
      const activeEl = getRef(currentActive);

      // If we're already playing the same src on the active slot and looping,
      // don't restart — just update onEnded and return.
      if (sameSrcOnActive && opts.loop && activeEl && !activeEl.paused) {
        playTokenRef.current += 1;
        stopFade();
        onEndedRef.current = opts.onEnded ?? null;
        activeEl.muted = opts.muted ?? activeEl.muted;
        activeEl.volume = BASE_VIDEO_VOLUME;
        return;
      }

      const nextSlot: Slot = currentActive === 'A' ? 'B' : 'A';
      const nextEl = getRef(nextSlot);
      if (!nextEl) return;

      const token = ++playTokenRef.current;
      stopFade();
      onEndedRef.current = opts.onEnded ?? null;
      const withSound = !(opts.muted ?? false);

      // Imperatively configure the next slot's <video> element.
      // The element is uncontrolled by React for these attributes to avoid races.
      nextEl.src = src;
      nextEl.muted = opts.muted ?? false;
      nextEl.loop = opts.loop ?? false;
      nextEl.playsInline = true;
      nextEl.volume = withSound ? 0 : BASE_VIDEO_VOLUME;
      currentSrcRef.current = { ...currentSrcRef.current, [nextSlot]: src };

      try {
        nextEl.currentTime = 0;
      } catch {
        /* readyState may not be ready yet */
      }

      // Update the active slot synchronously so back-to-back play() calls
      // route to the correct slot without waiting for React state to commit.
      activeRef.current = nextSlot;

      // El cambio visible espera a que el clip pueda reproducirse sin trabarse
      // y a que YA esté en marcha: si se muestra antes, el crossfade enseña el
      // primer frame congelado y la respuesta parece pausada. Mientras tanto
      // sigue a la vista el anterior.
      await waitForReady(nextEl);
      if (token !== playTokenRef.current) return;

      try {
        await nextEl.play();
        if (token !== playTokenRef.current) return;
        if (withSound) fadeIn(nextEl);
      } catch {
        /* autoplay may be blocked; UI surfaces a CTA */
        if (token !== playTokenRef.current) return;
      }
      setActive(nextSlot);

      // Pause the previous slot after the crossfade completes (la opacidad del
      // VideoStage dura 500 ms: pausarlo antes lo congela a media transición).
      const prevEl = getRef(currentActive);
      if (prevEl && prevEl !== nextEl) {
        window.setTimeout(() => {
          if (activeRef.current !== currentActive) {
            prevEl.pause();
          }
        }, CROSSFADE_MS);
      }
    },
    [fadeIn, getRef, stopFade],
  );

  const unlock = useCallback(() => {
    const activeSlot = activeRef.current;
    (['A', 'B'] as Slot[]).forEach((slot) => {
      const el = getRef(slot);
      if (!el) return;

      // El slot activo suele estar reproduciendo el loop muteado por defecto.
      // Un play() ligado al gesto lo "activa por usuario" sin pausarlo ni cortar
      // el loop visible.
      if (slot === activeSlot && !el.paused) {
        el.play().catch(() => {
          /* ya en reproducción; ignorar */
        });
        return;
      }

      // Slot inactivo (invisible): darle un src cacheado si no tiene, reproducir
      // muteado un instante y pausar. Eso lo deja desbloqueado para audio futuro.
      if (!el.src) el.src = VIDEOS.defaultWait;
      el.muted = true;
      el.playsInline = true;
      const unlockSrc = el.src;
      const p = el.play();
      if (p) {
        p.then(() => {
          // El play() del desbloqueo tarda un par de vueltas en resolverse, y en
          // ese hueco lo normal es que ya se haya lanzado el vídeo de verdad en
          // ESTE mismo slot (unlock() y el primer play() salen del mismo gesto).
          // Pausar a ciegas aquí congelaba la introducción nada más empezar.
          if (activeRef.current === slot || el.src !== unlockSrc) return;
          el.pause();
          try {
            el.currentTime = 0;
          } catch {
            /* readyState puede no estar listo */
          }
        }).catch(() => {
          /* el play de desbloqueo puede rechazarse; no es crítico */
        });
      }
    });
  }, [getRef]);

  /**
   * Calla el clip en curso AHORA.
   *
   * No basta con pedir el siguiente vídeo: `play()` espera a que el nuevo clip
   * pueda reproducirse y sólo pausa el anterior 400 ms después, así que el
   * avatar seguiría hablando mientras se abre el micrófono. Además se invalida
   * el token, por si había un play() en vuelo, y se descarta el `onEnded` del
   * clip cortado: ese final ya no va a llegar.
   */
  const stop = useCallback(() => {
    playTokenRef.current += 1;
    stopFade();
    onEndedRef.current = null;
    const el = getRef(activeRef.current);
    if (!el) return;
    el.pause();
    el.muted = true;
  }, [getRef, stopFade]);

  const getActiveSrc = useCallback(
    () => currentSrcRef.current[activeRef.current],
    [],
  );

  return { refA, refB, active, play, stop, unlock, getActiveSrc };
};

export { useVideoPlayer };
