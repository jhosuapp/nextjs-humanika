import type { CSSProperties } from 'react';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

import styles from './spotlight.module.css';

type SpotlightProps = {
  /** Radius of the glow in px. */
  size?: number;
  /** Color (any CSS color) of the glow at its center. */
  color?: string;
  className?: string;
};

/**
 * Pointer-following radial glow. Drop it as the first child of any card that is
 * `position: relative; overflow: hidden`; it auto-attaches to its parent element
 * and needs no handler wiring from the consumer. Renders nothing when the user
 * prefers reduced motion.
 */
const Spotlight = ({
  size = 240,
  color = 'rgba(0, 177, 215, 0.16)',
  className,
}: SpotlightProps) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduce) return;
    const node = ref.current;
    const parent = node?.parentElement;
    if (!node || !parent) return;

    const handleMove = (event: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      node.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`);
      node.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`);
    };
    const handleEnter = () => {
      node.style.opacity = '1';
    };
    const handleLeave = () => {
      node.style.opacity = '0';
    };

    parent.addEventListener('pointermove', handleMove);
    parent.addEventListener('pointerenter', handleEnter);
    parent.addEventListener('pointerleave', handleLeave);

    return () => {
      parent.removeEventListener('pointermove', handleMove);
      parent.removeEventListener('pointerenter', handleEnter);
      parent.removeEventListener('pointerleave', handleLeave);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`${styles.spotlight} ${className ?? ''}`}
      style={
        {
          '--spotlight-size': `${size}px`,
          '--spotlight-color': color,
        } as CSSProperties
      }
    />
  );
};

export { Spotlight };
