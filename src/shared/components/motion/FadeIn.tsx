import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import type { ElementType, ReactNode, Ref } from 'react';
import { useRef } from 'react';

import { DURATION, EASE, REVEAL } from '@/src/shared/helpers/motion-variants';

type FadeInProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
  duration?: keyof typeof DURATION;
};

const FadeIn = ({
  children,
  className,
  as = 'div',
  delay = 0,
  y = REVEAL.y,
  once = REVEAL.once,
  amount = REVEAL.amount,
  duration = 'base',
}: FadeInProps) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once, amount });
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  const variants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DURATION[duration],
        ease: EASE,
        delay,
      },
    },
  };

  return (
    <MotionTag
      ref={ref as Ref<HTMLDivElement>}
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </MotionTag>
  );
};

export { FadeIn };
