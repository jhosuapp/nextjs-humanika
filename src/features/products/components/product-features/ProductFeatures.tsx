import type { JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import type { ProductEntry } from '@/src/features/products/types/product.types';
import { Container } from '@/src/features/home/components/container/Container';
import { SectionHeader } from '@/src/shared/components/section-header/SectionHeader';
import { StaggerGroup, StaggerItem } from '@/src/shared/components/motion/StaggerGroup';
import { Spotlight } from '@/src/shared/components/spotlight/Spotlight';

import styles from './product-features.module.css';

type ProductFeaturesProps = {
  t: ITranslations;
  entry: ProductEntry;
  shortTitle: string;
};

const ProductFeatures = ({
  t,
  entry,
  shortTitle,
}: ProductFeaturesProps): JSX.Element => {
  const features = t(`items.${entry.slug}.features`, {
    returnObjects: true,
  }) as string[];

  return (
    <div className={styles.section}>
      <Container padding="xl">
        <SectionHeader
          className={styles.header}
          eyebrow={t('ui.featuresEyebrow') as string}
          title={t('ui.featuresTitle', { product: shortTitle }) as string}
          description={t('ui.featuresDescription') as string}
        />

        <StaggerGroup as="ol" className={styles.grid} stagger={0.1}>
          {features.map((feature, index) => (
            <StaggerItem as="li" key={feature} className={styles.item}>
              <article className={`${styles.card} gl-gradient-box gl-card`}>
                <Spotlight size={320} />
                <div className={styles.cardTop}>
                  <span className={styles.icon} aria-hidden="true">
                    <FontAwesomeIcon icon={entry.featureIcons[index]} />
                  </span>
                  <span className={styles.number} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className={styles.feature}>{feature}</h3>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </div>
  );
};

export { ProductFeatures };
