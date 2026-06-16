import type { Variants } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const DURATION = {
  fast: 0.4,
  base: 0.6,
  slow: 0.9,
} as const;

// Shared scroll-reveal timing for every home section (the hero is excluded —
// it owns its own intro animation). Keeps the viewport trigger, the grid
// stagger and the header cascade identical across sections.
const REVEAL = {
  amount: 0.15, // fraction of the element visible before it animates in
  stagger: 0.08, // gap between staggered grid/list children
  step: 0.08, // delay added per element in a header cascade
} as const;

/** Cascade delay (seconds) for the Nth revealed element in a header, 0-based. */
const revealDelay = (index: number): number =>
  Number((index * REVEAL.step).toFixed(2));

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.fast, ease: EASE },
  },
};

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

const revealMask: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

const staggerParent = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

export {
  EASE,
  DURATION,
  REVEAL,
  revealDelay,
  fadeIn,
  fadeUp,
  scaleIn,
  slideInLeft,
  slideInRight,
  revealMask,
  staggerParent,
  staggerChild,
};
