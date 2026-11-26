import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import type { ElementType, ReactNode, Ref } from 'react';
import { useRef } from 'react';

import { REVEAL } from '@/src/shared/helpers/motion-variants';

/**
 * Scroll reveal primitives (single element, or a group whose items stagger).
 * Timing comes from the shared `REVEAL` tokens so every section of the site
 * appears the same way.
 */
const itemVariants = (reduce: boolean): Variants => ({
  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: REVEAL.y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL.duration, ease: REVEAL.ease },
  },
});

const groupVariants = (reduce: boolean): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: reduce ? 0 : REVEAL.stagger },
  },
});

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

// Reveals a single element (or a self-contained card) as one unit on scroll.
const Reveal = ({ children, className, as = 'div' }: RevealProps) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: REVEAL.once, amount: REVEAL.amount });
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      ref={ref as Ref<HTMLDivElement>}
      className={className}
      variants={itemVariants(!!reduce)}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </MotionTag>
  );
};

// Parent for a collection whose RevealItem children stagger in on scroll.
const RevealGroup = ({ children, className, as = 'div' }: RevealProps) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: REVEAL.once, amount: REVEAL.amount });
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      ref={ref as Ref<HTMLDivElement>}
      className={className}
      variants={groupVariants(!!reduce)}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </MotionTag>
  );
};

// A single member of a RevealGroup. Uses the same item variant as Reveal.
const RevealItem = ({ children, className, as = 'div' }: RevealProps) => {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag className={className} variants={itemVariants(!!reduce)}>
      {children}
    </MotionTag>
  );
};

export { Reveal, RevealGroup, RevealItem, REVEAL };
