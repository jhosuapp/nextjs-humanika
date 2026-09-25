import { motion, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import type { JSX } from 'react';

import { useAudioLevel } from '@/src/features/bot/hooks/useAudioLevel';
import { useBotStore } from '@/src/features/bot/stores/bot.store';

import styles from './voice-indicator.module.css';

interface CircleSpec {
  base: number;
  color: string;
  boost: number;
  overlap?: number;
}

const CIRCLES: CircleSpec[] = [
  { base: 14, color: 'var(--secondary)', boost: 0.35 },
  { base: 22, color: 'var(--tertiary)', boost: 0.45 },
  { base: 64, color: 'var(--primary)', boost: 0.9, overlap: 10 },
  { base: 20, color: 'var(--secondary)', boost: 0.4, overlap: 6 },
  { base: 12, color: 'var(--secondary)', boost: 0.3 },
  { base: 46, color: 'var(--tertiary)', boost: 0.75, overlap: 4 },
  { base: 18, color: 'var(--tertiary)', boost: 0.4 },
  { base: 22, color: 'var(--secondary)', boost: 0.45 },
  { base: 10, color: 'var(--tertiary)', boost: 0.3 },
];

interface CircleProps {
  spec: CircleSpec;
  level: MotionValue<number>;
  staticScale: boolean;
}

const Circle = ({ spec, level, staticScale }: CircleProps): JSX.Element => {
  const scale = useTransform(level, (v) => 1 + v * spec.boost);
  return (
    <motion.span
      className={styles.dot}
      style={{
        width: spec.base,
        height: spec.base,
        background: spec.color,
        marginLeft: spec.overlap ? -spec.overlap : undefined,
        scale: staticScale ? 1 : scale,
      }}
    />
  );
};

const VoiceIndicator = (): JSX.Element => {
  const reduce = useReducedMotion();
  // El medidor abre su propio micrófono: se cierra en cuanto el bot deja de
  // escuchar, sin esperar a que termine la animación de salida. Si no, sigue
  // abierto cuando arranca la respuesta y los audífonos Bluetooth cambian de
  // modo con el clip ya sonando.
  const listening = useBotStore((s) => s.state === 'LISTENING');
  const level = useAudioLevel({ enabled: listening });
  return (
    <div className={styles.row} aria-hidden="true">
      {CIRCLES.map((spec, i) => (
        <Circle key={i} spec={spec} level={level} staticScale={!!reduce} />
      ))}
    </div>
  );
};

export { VoiceIndicator };
