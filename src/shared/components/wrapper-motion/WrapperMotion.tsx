import type { JSX } from 'react';
import { motion } from 'framer-motion';

import styles from './wrapper-motion.module.css';
import { fadeUpMotion, fadeUpTertiaryMotion } from '../../motion/fadeUp.motion';
import { zoomInMotion } from '../../motion/zoomIn.motion';


type WrapperProps = {
  children: React.ReactNode;
  delay: { enter: number, exit: number };
  fadeUpTertiary?: boolean;
  zoomIn?: boolean;
  immediate?: boolean;
  className?: string;
  classNameSecondary?: string;
}

const WrapperMotion = ({ children, delay, fadeUpTertiary, zoomIn, immediate, className = '', classNameSecondary = '' }: WrapperProps): JSX.Element => {
  const { initial, animate, exit } = zoomIn
    ? zoomInMotion(delay?.enter, delay?.exit)
    : fadeUpTertiary
      ? fadeUpTertiaryMotion(delay?.enter, delay?.exit)
      : fadeUpMotion(delay?.enter, delay?.exit);

  return (
    <article className={`${styles.wrapperMotion} ${className}`}>
      <motion.div
        initial={initial}
        {...(immediate
          ? { animate }
          : { whileInView: animate, viewport: { once: true, amount: 0.2 } }
        )}
        exit={exit}
        className={classNameSecondary}
      >
        {children}
      </motion.div>
    </article>
  )
}

export { WrapperMotion }