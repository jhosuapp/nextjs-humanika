import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import type { ElementType, ReactNode, Ref } from 'react';
import { useRef } from 'react';

import { REVEAL } from '@/src/shared/helpers/motion-variants';

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number;
};

const StaggerGroup = ({
  children,
  className,
  as = 'div',
  stagger = REVEAL.stagger,
  delayChildren = 0,
  once = REVEAL.once,
  amount = REVEAL.amount,
}: StaggerGroupProps) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once, amount });
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  const parentVariants: Variants = {
    hidden: {},
    visible: {
      transition: reduce
        ? { staggerChildren: 0, delayChildren: 0 }
        : { staggerChildren: stagger, delayChildren },
    },
  };

  return (
    <MotionTag
      ref={ref as Ref<HTMLDivElement>}
      className={className}
      variants={parentVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </MotionTag>
  );
};

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  y?: number;
};

const StaggerItem = ({
  children,
  className,
  as = 'div',
  y = REVEAL.y,
}: StaggerItemProps) => {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  const childVariants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: REVEAL.duration, ease: REVEAL.ease },
    },
  };

  return (
    <MotionTag className={className} variants={childVariants}>
      {children}
    </MotionTag>
  );
};

export { StaggerGroup, StaggerItem };
