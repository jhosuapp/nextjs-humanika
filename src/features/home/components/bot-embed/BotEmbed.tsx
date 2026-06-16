import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState, type JSX } from 'react';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { VIDEOS } from '@/src/features/bot/data/bot-content';
import { BotStage } from '@/src/features/bot/views/BotStage';
import { ChatPanel } from '@/src/features/bot/components/chat-panel/ChatPanel';
import { useBotEngine } from '@/src/features/bot/hooks/useBotEngine';
import { useMicPermission } from '@/src/features/bot/hooks/useMicPermission';

import styles from './bot-embed.module.css';

interface Props {
  t: ITranslations;
}

const BotEmbedInner = ({ t }: Props): JSX.Element => {
  const router = useRouter();
  const locale = router.locale ?? 'es';

  const { permission, request } = useMicPermission();
  const engine = useBotEngine({ locale });

  const requestedRef = useRef(false);
  useEffect(() => {
    if (!requestedRef.current) {
      requestedRef.current = true;
      request();
    }
  }, [request]);

  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (engine.state === 'IDLE' && !autoStartedRef.current) {
      autoStartedRef.current = true;
      engine.start();
    }
  }, [engine.state, engine.start]);

  return (
    <>
      <BotStage
        t={t}
        engine={engine}
        permission={permission}
        onRequestPermission={request}
        embedded
      />
      <ChatPanel t={t} embedded />
    </>
  );
};


const BotEmbed = ({ t }: Props): JSX.Element => {
  const [armed, setArmed] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.frame}>
        <video
          className={styles.previewVideo}
          src={VIDEOS.defaultWait}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        {armed ? (
          <BotEmbedInner t={t} />
        ) : (
          <button
            type="button"
            className={styles.playBtn}
            onClick={() => setArmed(true)}
            aria-label={t('idle.ctaStart') as string}
          >
            <FontAwesomeIcon icon={faPlay} aria-hidden="true" />
            <span>{ t('wakeWords.initBot') }</span>
          </button>
        )}
      </div>
    </div>
  );
};
export { BotEmbed };
