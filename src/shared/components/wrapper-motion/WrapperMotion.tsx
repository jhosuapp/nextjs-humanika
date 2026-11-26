import type { JSX } from 'react';
import { motion } from 'framer-motion';

import { REVEAL } from '@/src/shared/helpers/motion-variants';

import styles from './wrapper-motion.module.css';
import { fadeUpMotion, fadeUpTertiaryMotion } from '../../motion/fadeUp.motion';
import { revealMotion } from '../../motion/reveal.motion';
import { zoomInMotion } from '../../motion/zoomIn.motion';

type WrapperProps = {
  children: React.ReactNode;
  delay: { enter: number, exit: number };
  fadeUpTertiary?: boolean;
  zoomIn?: boolean;
  /** Plays on mount (page heroes, synced with the PageTransition curtain). */
  immediate?: boolean;
  className?: string;
  classNameSecondary?: string;
}

/**
 * Two modes:
 * - `immediate` (heroes): the hero choreography presets (fadeUp springs),
 *   timed with the page curtain — unchanged.
 * - On scroll (default): the shared REVEAL language (24px, 0.6s tween), the
 *   same one FadeIn / Stagger / Reveal use, so every section matches.
 * `zoomIn` keeps its "pop" in both modes (badges, small accents).
 */
const pickMotion = ({ delay, fadeUpTertiary, zoomIn, immediate }: WrapperProps) => {
  if (zoomIn) return zoomInMotion(delay?.enter, delay?.exit);
  if (!immediate) return revealMotion(delay?.enter, delay?.exit);
  return fadeUpTertiary
    ? fadeUpTertiaryMotion(delay?.enter, delay?.exit)
    : fadeUpMotion(delay?.enter, delay?.exit);
};

const WrapperMotion = (props: WrapperProps): JSX.Element => {
  const { children, immediate, className = '', classNameSecondary = '' } = props;
  const { initial, animate, exit } = pickMotion(props);

  return (
    <div className={`${styles.wrapperMotion} ${className}`}>
      <motion.div
        initial={initial}
        {...(immediate
          ? { animate }
          : { whileInView: animate, viewport: { once: REVEAL.once, amount: REVEAL.amount } }
        )}
        exit={exit}
        className={classNameSecondary}
      >
        {children}
      </motion.div>
    </div>
  )
}

export { WrapperMotion }
