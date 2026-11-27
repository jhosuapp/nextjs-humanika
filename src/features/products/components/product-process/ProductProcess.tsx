import type { JSX } from 'react';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { Container } from '@/src/features/home/components/container/Container';
import { SectionHeader } from '@/src/shared/components/section-header/SectionHeader';
import { StaggerGroup, StaggerItem } from '@/src/shared/components/motion/StaggerGroup';
import { REVEAL } from '@/src/shared/helpers/motion-variants';

import styles from './product-process.module.css';

type ProductProcessProps = {
  t: ITranslations;
  slug: string;
};

type ProcessStage = { label: string; title: string; text: string };
type ProcessCopy = { title: string; description?: string; stages: ProcessStage[] };

/**
 * Optional "step by step" section: how the agent supports each stage of the
 * institutional process (procurement, supervision, accountability). Renders
 * nothing when the product has no `items.<slug>.process` copy.
 */
const ProductProcess = ({ t, slug }: ProductProcessProps): JSX.Element | null => {
  const copy = t(`items.${slug}.process`, { returnObjects: true }) as ProcessCopy | string;
  if (typeof copy !== 'object' || !Array.isArray(copy.stages)) return null;

  return (
    <div className={styles.section} data-section="process">
      <Container padding="xl">
        <SectionHeader
          className={styles.header}
          eyebrow={t('ui.processEyebrow') as string}
          title={copy.title}
          description={copy.description}
        />

        <StaggerGroup as="ol" className={styles.grid} stagger={REVEAL.stagger} amount={REVEAL.amount}>
          {copy.stages.map((stage, index) => (
            <StaggerItem as="li" key={stage.label} className={styles.item}>
              <article className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.number} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.label}>{stage.label}</span>
                </div>
                <h3 className={styles.title}>{stage.title}</h3>
                <p className={styles.text}>{stage.text}</p>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </div>
  );
};

export { ProductProcess };
