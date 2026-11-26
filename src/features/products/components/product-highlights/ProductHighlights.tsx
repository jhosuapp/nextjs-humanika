import type { JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { Container } from '@/src/features/home/components/container/Container';
import { SectionHeader } from '@/src/shared/components/section-header/SectionHeader';
import { StaggerGroup, StaggerItem } from '@/src/shared/components/motion/StaggerGroup';
import { REVEAL } from '@/src/shared/helpers/motion-variants';

import styles from './product-highlights.module.css';

type ProductHighlightsProps = {
  t: ITranslations;
  slug: string;
};

type HighlightsCopy = { title: string; items: string[] };

/**
 * Optional "more capabilities" list for products whose platform support goes
 * beyond the three brief features (MGA, languages). Renders nothing when the
 * product has no `items.<slug>.highlights` copy.
 */
const ProductHighlights = ({ t, slug }: ProductHighlightsProps): JSX.Element | null => {
  const copy = t(`items.${slug}.highlights`, { returnObjects: true }) as HighlightsCopy | string;
  if (typeof copy !== 'object' || !Array.isArray(copy.items)) return null;

  return (
    <div className={styles.section}>
      <Container padding="xl">
        <SectionHeader
          className={styles.header}
          eyebrow={t('ui.highlightsEyebrow') as string}
          title={copy.title}
        />
        <StaggerGroup as="ul" className={styles.list} stagger={REVEAL.stagger} amount={REVEAL.amount}>
          {copy.items.map((item) => (
            <StaggerItem as="li" key={item} className={styles.item}>
              <span className={styles.check} aria-hidden="true">
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span>{item}</span>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </div>
  );
};

export { ProductHighlights };
