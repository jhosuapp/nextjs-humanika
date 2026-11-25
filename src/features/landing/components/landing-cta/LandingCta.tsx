import type { JSX } from 'react';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { Container } from '@/src/features/home/components/container/Container';
import { Button } from '@/src/shared/components/button/Button';
import { FadeIn } from '@/src/shared/components/motion/FadeIn';
import { pushDataLayer } from '@/src/shared/helpers/data-layer';

import styles from './landing-cta.module.css';

type LandingCtaProps = {
  t: ITranslations;
  namespace: string;
  demoUrl: string;
};

const LandingCta = ({ t, namespace, demoUrl }: LandingCtaProps): JSX.Element => (
  <div className={styles.section}>
    <Container padding="lg">
      <FadeIn className={`${styles.card} gl-gradient-box`}>
        <div className={styles.copy}>
          <p className="gl-eyebrow-accent">{t('cta.eyebrow') as string}</p>
          <h2 className={styles.title}>{t('cta.title') as string}</h2>
          <p className={styles.description}>{t('cta.description') as string}</p>
        </div>
        <div className={styles.action}>
          <Button
            text={t('cta.button') as string}
            style="primary"
            type="button"
            iconRight={faWhatsapp}
            redirectTo={demoUrl}
            onClick={() => pushDataLayer({ event: 'demo_request_click', page: namespace })}
          />
        </div>
      </FadeIn>
    </Container>
  </div>
);

export { LandingCta };
