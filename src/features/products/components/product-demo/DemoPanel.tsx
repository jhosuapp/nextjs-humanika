import type { JSX } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay, faRobot } from '@fortawesome/free-solid-svg-icons';

import { EASE } from '@/src/shared/helpers/motion-variants';

import styles from './demo-panel.module.css';

type ChatLine = { from: 'user' | 'bot' | 'system'; text: string };

type DemoPanelProps = {
  steps: { title: string; text: string }[];
  chat: ChatLine[];
  stepIndex: number;
  visibleMessages: number;
  playing: boolean;
  /** ms each step lasts while autoplaying (drives the progress bar). */
  stepMs: number;
  labels: {
    agent: string;
    online: string;
    simulation: string;
    play: string;
    pause: string;
    step: string;
  };
  onSelect: (index: number) => void;
  onTogglePlay: () => void;
};

const DemoPanel = ({
  steps,
  chat,
  stepIndex,
  visibleMessages,
  playing,
  stepMs,
  labels,
  onSelect,
  onTogglePlay,
}: DemoPanelProps): JSX.Element => {
  const lines = chat.slice(0, visibleMessages);

  return (
    <div className={styles.panel}>
      <ol className={styles.steps}>
        {steps.map((step, index) => {
          const active = index === stepIndex;
          return (
            <li key={step.title}>
              <button
                type="button"
                className={styles.step}
                data-active={active}
                aria-current={active ? 'step' : undefined}
                onClick={() => onSelect(index)}
              >
                <span className={styles.stepNumber}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.stepBody}>
                  <span className={styles.stepTitle}>{step.title}</span>
                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.span
                        className={styles.stepText}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        {step.text}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                {active && (
                  <motion.span
                    key={`${index}-${playing}`}
                    className={styles.stepProgress}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: playing ? 1 : 0 }}
                    transition={{
                      duration: playing ? stepMs / 1000 : 0.2,
                      ease: 'linear',
                    }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <div className={styles.chat} aria-live="polite">
        <header className={styles.chatHeader}>
          <span className={styles.avatar} aria-hidden="true">
            <FontAwesomeIcon icon={faRobot} />
          </span>
          <span className={styles.chatTitle}>
            <strong>{labels.agent}</strong>
            <span>
              <span className={styles.onlineDot} aria-hidden="true" />
              {labels.online}
            </span>
          </span>
          <button
            type="button"
            className={styles.playButton}
            onClick={onTogglePlay}
            aria-label={playing ? labels.pause : labels.play}
          >
            <FontAwesomeIcon icon={playing ? faPause : faPlay} />
          </button>
        </header>

        <div className={styles.messages}>
          <AnimatePresence initial={false} mode="popLayout">
            {lines.map((line, index) => (
              <motion.p
                layout
                key={`${index}-${line.text}`}
                className={styles.message}
                data-from={line.from}
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.35 }}
              >
                {line.text}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>

        <footer className={styles.chatFooter}>{labels.simulation}</footer>
      </div>
    </div>
  );
};

export { DemoPanel };
export type { ChatLine };
