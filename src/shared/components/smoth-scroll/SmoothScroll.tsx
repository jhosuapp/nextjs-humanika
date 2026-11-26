import Lenis from 'lenis';
import { useEffect } from 'react';

import { useLenisStore } from '@/src/shared/stores/lenis.store';

const SmoothScroll = () => {
  useEffect(() => {
    // Users who prefer reduced motion get native scrolling (lerp 1 = no
    // easing). `duration`/`easing` were ignored anyway because `lerp` wins.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = new Lenis({
      lerp: reduce ? 1 : 0.1,
      smoothWheel: !reduce,
    });

    useLenisStore.getState().setLenis(lenis);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    resizeObserver.observe(document.body);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      lenis.destroy();
    };
  }, []);

  return null;
};

export { SmoothScroll };
