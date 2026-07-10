import { AnimatePresence, motion } from 'framer-motion';
import type { JSX } from 'react';

import { DURATION, EASE } from '@/src/shared/helpers/motion-variants';
import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { ErrorScreen } from '@/src/features/bot/components/error-screen/ErrorScreen';
import { InactivityWarning } from '@/src/features/bot/components/inactivity-warning/InactivityWarning';
import { PermissionGate } from '@/src/features/bot/components/permission-gate/PermissionGate';
import { StatusIndicator } from '@/src/features/bot/components/status-indicator/StatusIndicator';
import { VideoStage } from '@/src/features/bot/components/video-stage/VideoStage';
import { VoiceControl } from '@/src/features/bot/components/voice-control/VoiceControl';
import type { useBotEngine } from '@/src/features/bot/hooks/useBotEngine';
import { useBotStore } from '@/src/features/bot/stores/bot.store';
import { BotSpinner } from '../components/bot-spinner/BotSpinner';

import styles from './bot-stage.module.css';

interface Props {
  t: ITranslations;
  engine: ReturnType<typeof useBotEngine>;
  permission: 'unknown' | 'granted' | 'denied';
  onRequestPermission: () => void;
  embedded?: boolean;
}

const BotStage = ({
  t,
  engine,
  permission,
  onRequestPermission,
  embedded = false,
}: Props): JSX.Element => {
  const statusKey = useBotStore((s) => s.statusKey);
  const errorMessage = useBotStore((s) => s.errorMessage);
  const inactivityWarning = useBotStore((s) => s.inactivityWarning);

  const handleInterrupt = () => {
    if (engine.state === 'INTRO' || engine.state === 'RESPONDING' || engine.state === 'THINKING') {
      useBotStore.getState().setState('LISTENING');
    }
  };

  const containerClass = `${styles.stageContainer} ${embedded ? styles.embedded : ''}`;

  return (
    <div className={containerClass}>
      <VideoStage
        refA={engine.videoPlayer.refA}
        refB={engine.videoPlayer.refB}
        active={engine.videoPlayer.active}
      />

      <div className={`${styles.toastSlot} ${styles.toastSlot__center}`}>
        <InactivityWarning
          t={t}
          visible={inactivityWarning}
          onDismiss={() => engine.inactivity.reset()}
        />
      </div>

      <div className={styles.toastSlot}>
        <AnimatePresence mode="wait">
          {engine.state === 'THINKING' && (
            <motion.div
              key="thinking"
              className={`${styles.listening} gl-dropshadow !px-3`}
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: DURATION.fast, ease: EASE }}
            >
              <BotSpinner />
            </motion.div>
          )}
          {engine.state === 'LISTENING' && !inactivityWarning && (
            <motion.div
              key="listening"
              className={`${styles.listening} gl-dropshadow`}
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: DURATION.fast, ease: EASE }}
            >
              <span className='gl-dot'></span>
              <p className={'gl-label'}>{t('listening.instruction')}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.controls}>
        <VoiceControl
          t={t}
          state={engine.state}
          isListening={engine.speech.isListening}
          onStart={engine.start}
          onInterrupt={handleInterrupt}
        />
        {engine.state === 'THINKING' ? (
          <StatusIndicator t={t} statusKey={statusKey} />
        ) : null}
      </div>

      <AnimatePresence>
        {engine.state === 'PERMISSION_PENDING' && (!embedded || permission === 'denied') ? (
          <PermissionGate
            key="permission"
            t={t}
            permission={permission}
            onRequest={onRequestPermission}
          />
        ) : null}

        {engine.state === 'ERROR' ? (
          <ErrorScreen
            key="error"
            t={t}
            message={errorMessage}
            onReset={engine.reset}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export { BotStage };
