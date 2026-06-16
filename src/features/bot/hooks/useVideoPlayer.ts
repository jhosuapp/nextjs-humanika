import { useCallback, useEffect, useRef, useState } from 'react';

// Límite de volumen base para TODOS los videos (intro, respuestas…): nunca suenan
// al 100% para que la voz del bot no se cruce con la del usuario. El ducking por
// voz baja aún más este valor de forma puntual.
const BASE_VIDEO_VOLUME = 0.6;

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
        onEndedRef.current = opts.onEnded ?? null;
        activeEl.muted = opts.muted ?? activeEl.muted;
        activeEl.volume = BASE_VIDEO_VOLUME;
        return;
      }

      const nextSlot: Slot = currentActive === 'A' ? 'B' : 'A';
      const nextEl = getRef(nextSlot);
      if (!nextEl) return;

      onEndedRef.current = opts.onEnded ?? null;

      // Imperatively configure the next slot's <video> element.
      // The element is uncontrolled by React for these attributes to avoid races.
      nextEl.src = src;
      nextEl.muted = opts.muted ?? false;
      nextEl.loop = opts.loop ?? false;
      nextEl.playsInline = true;
      nextEl.volume = BASE_VIDEO_VOLUME;
      currentSrcRef.current = { ...currentSrcRef.current, [nextSlot]: src };

      try {
        nextEl.currentTime = 0;
      } catch {
        /* readyState may not be ready yet */
      }

      // Update the active slot synchronously so back-to-back play() calls
      // route to the correct slot without waiting for React state to commit.
      activeRef.current = nextSlot;
      setActive(nextSlot);

      try {
        await nextEl.play();
      } catch {
        /* autoplay may be blocked; UI surfaces a CTA */
      }

      // Pause the previous slot after the crossfade completes.
      const prevEl = getRef(currentActive);
      if (prevEl && prevEl !== nextEl) {
        window.setTimeout(() => {
          if (activeRef.current !== currentActive) {
            prevEl.pause();
          }
        }, 400);
      }
    },
    [getRef],
  );

  const getActiveSrc = useCallback(
    () => currentSrcRef.current[activeRef.current],
    [],
  );

  return { refA, refB, active, play, getActiveSrc };
};

export { useVideoPlayer };
