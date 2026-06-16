import { useRouter } from 'next/router';
import type { JSX } from 'react';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { BotStage } from '@/src/features/bot/views/BotStage';
import { ChatPanel } from '@/src/features/bot/components/chat-panel/ChatPanel';
import { useBotEngine } from '@/src/features/bot/hooks/useBotEngine';
import { useMicPermission } from '@/src/features/bot/hooks/useMicPermission';
import { MainContent } from '@/src/shared/components/main-content/MainContent';

import styles from './bot.module.css';

interface Props {
  t: ITranslations;
}

const BotView = ({ t }: Props): JSX.Element => {
  const router = useRouter();
  const locale = router.locale ?? 'es';

  const { permission, request } = useMicPermission();
  const engine = useBotEngine({ locale });

  return (
    <MainContent className={styles.shell}>
      <BotStage
        t={t}
        engine={engine}
        permission={permission}
        onRequestPermission={request}
      />
      <ChatPanel t={t} />
    </MainContent>
  );
};

export { BotView };
