import type { JSX } from 'react';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { Text } from '@/src/shared/components/text/Text';
import { Button } from '@/src/shared/components/button/Button';
import { Reveal } from '@/src/features/article/components/reveal/Reveal';
import { WHATSAPP_URL } from '@/src/config/site';
import { pushDataLayer } from '@/src/shared/helpers/data-layer';

import styles from './article-cta.module.css';

type ArticleCtaProps = { t: ITranslations; tKey?: string };

const ArticleCta = ({ t, tKey = 'cta' }: ArticleCtaProps): JSX.Element => {
  const openWhatsApp = () => {
    pushDataLayer({ event: 'whatsapp_click' });
    window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.inner}>
      <Reveal className={`${styles.card} gl-gradient-box`}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.copy}>
          <Text tag="h2" variant="title_small" color="secondary" weight="bold" noMotion>
            {t(`${tKey}.title`) as string}
          </Text>
          <Text tag="p" variant="description" color="muted" noMotion>
            {t(`${tKey}.description`) as string}
          </Text>
        </div>
        <div className={styles.action}>
          <Button
            text={t(`${tKey}.button`) as string}
            style="whatsapp"
            type="button"
            iconRight={faWhatsapp}
            onClick={openWhatsApp}
          />
        </div>
      </Reveal>
    </div>
  );
};

export { ArticleCta };
