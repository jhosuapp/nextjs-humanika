import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { EASE } from '@/src/shared/helpers/motion-variants';

type AnimatedCounterProps = {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
  /** Intersection threshold before the count-up fires. */
  amount?: number;
};

const AnimatedCounter = ({
  to,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.6,
  className,
  amount = 0.6,
}: AnimatedCounterProps) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const format = (value: number) =>
      `${prefix}${value.toLocaleString('es-CO', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

    if (!inView) {
      node.textContent = format(0);
      return;
    }

    if (reduce) {
      node.textContent = format(to);
      return;
    }

    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (value) => {
        node.textContent = format(value);
      },
    });

    return () => controls.stop();
  }, [inView, to, prefix, suffix, decimals, duration, reduce]);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${to}${suffix}`}>
      {`${prefix}0${suffix}`}
    </span>
  );
};

export { AnimatedCounter };
