import { REVEAL } from "@/src/shared/helpers/motion-variants";

import { PartialMotionVariants } from "../interfaces/motion.interface";

/**
 * Scroll reveal as motion props (initial / animate / exit), built from the
 * shared `REVEAL` tokens. Used by WrapperMotion (and so by `Text`) whenever an
 * element appears on scroll, so text reveals match FadeIn / Stagger / Reveal.
 */
export const revealMotion = (
  delayAnimate = 0,
  delayExit = 0,
): PartialMotionVariants => ({
  initial: { opacity: 0, y: REVEAL.y },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL.duration, ease: REVEAL.ease, delay: delayAnimate },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, delay: delayExit },
  },
});
