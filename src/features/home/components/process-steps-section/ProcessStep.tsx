import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion';

import styles from './process-steps-section.module.css';

type ProcessStepProps = {
  index: number;
  active: boolean;
  icon: IconDefinition;
  label: string;
};

const circleVariants: Variants = {
  inactive: {
    scale: 0.55,
    opacity: 0.28,
    rotate: -25,
    filter: 'blur(3px) saturate(0.25)',
  },
  active: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    filter: 'blur(0px) saturate(1)',
    transition: {
      type: 'spring',
      stiffness: 230,
      damping: 14,
      mass: 0.6,
    },
  },
};

const iconVariants: Variants = {
  inactive: { scale: 0.5, rotate: -45, opacity: 0 },
  active: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 320,
      damping: 18,
      delay: 0.1,
    },
  },
};

const badgeVariants: Variants = {
  inactive: { scale: 0, opacity: 0, rotate: -140 },
  active: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 380,
      damping: 15,
      delay: 0.22,
    },
  },
};

const labelVariants: Variants = {
  inactive: { opacity: 0, y: 16 },
  active: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 22,
      delay: 0.28,
    },
  },
};

const haloVariants: Variants = {
  inactive: { opacity: 0, scale: 0.55 },
  active: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 140,
      damping: 18,
    },
  },
};

const glowVariants: Variants = {
  inactive: { opacity: 0, scale: 0.7 },
  active: {
    opacity: [0.45, 0.95, 0.45],
    scale: [0.95, 1.18, 0.95],
    transition: {
      opacity: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
      scale: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
    },
  },
};

const ProcessStep = ({ index, active, icon, label }: ProcessStepProps) => {
  const reduce = useReducedMotion();
  const state = reduce || active ? 'active' : 'inactive';

  return (
    <div className={styles.step}>
      <div className={styles.circleWrap}>
        <motion.span
          className={styles.halo}
          aria-hidden="true"
          variants={haloVariants}
          initial="inactive"
          animate={state}
        />
        <motion.span
          className={styles.glow}
          aria-hidden="true"
          variants={glowVariants}
          initial="inactive"
          animate={state}
        />
        <motion.div
          className={styles.circle}
          variants={circleVariants}
          initial="inactive"
          animate={state}
        >
          <motion.span
            className={styles.iconWrap}
            variants={iconVariants}
            initial="inactive"
            animate={state}
          >
            <FontAwesomeIcon icon={icon} className={styles.icon} />
          </motion.span>
        </motion.div>
        <motion.span
          className={styles.badge}
          variants={badgeVariants}
          initial="inactive"
          animate={state}
        >
          {index + 1}
        </motion.span>
      </div>
      <motion.span
        className={styles.label}
        variants={labelVariants}
        initial="inactive"
        animate={state}
      >
        {label}
      </motion.span>
    </div>
  );
};

export { ProcessStep };
