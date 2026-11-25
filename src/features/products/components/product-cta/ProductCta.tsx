import type { JSX } from 'react';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { Container } from '@/src/features/home/components/container/Container';
import { Button } from '@/src/shared/components/button/Button';
import { FadeIn } from '@/src/shared/components/motion/FadeIn';
import { Spotlight } from '@/src/shared/components/spotlight/Spotlight';
import { pushDataLayer } from '@/src/shared/helpers/data-layer';

import styles from './product-cta.module.css';

type ProductCtaProps = {
  t: ITranslations;
  slug: string;
  shortTitle: string;
  demoUrl: string;
};

const ProductCta = ({
  t,
  slug,
  shortTitle,
  demoUrl,
}: ProductCtaProps): JSX.Element => (
  <div className={styles.section}>
    <Container padding="lg">
      <FadeIn className={`${styles.card} gl-gradient-box`}>
        <Spotlight size={420} />
        <span className={styles.orb} aria-hidden="true" />
        <div className={styles.copy}>
          <p className="gl-eyebrow-accent">{t('ui.ctaEyebrow') as string}</p>
          <h2 className={styles.title}>
            {t('ui.ctaTitle', { product: shortTitle }) as string}
          </h2>
          <p className={styles.description}>
            {t('ui.ctaDescription') as string}
          </p>
        </div>
        <div className={styles.action}>
          <Button
            text={t('ui.demoCta') as string}
            style="primary"
            type="button"
            iconRight={faWhatsapp}
            redirectTo={demoUrl}
            onClick={() =>
              pushDataLayer({ event: 'demo_request_click', product: slug })
            }
          />
        </div>
      </FadeIn>
    </Container>
  </div>
);

export { ProductCta };
