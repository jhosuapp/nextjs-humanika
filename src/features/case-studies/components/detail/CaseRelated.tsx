import type { JSX } from 'react';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import type { CaseStudyEntry } from '@/src/features/case-studies/types/case-study.types';
import { Container } from '@/src/features/home/components/container/Container';
import { Text } from '@/src/shared/components/text/Text';
import { WrapperMotion } from '@/src/shared/components/wrapper-motion/WrapperMotion';
import { getSortedCaseStudies } from '@/src/features/case-studies/data/case-studies.registry';
import { CaseStudyCard } from '@/src/features/case-studies/components/case-study-card/CaseStudyCard';

import styles from './case-related.module.css';

type Props = { t: ITranslations; entry: CaseStudyEntry };

const CaseRelated = ({ t, entry }: Props): JSX.Element | null => {
  const related = getSortedCaseStudies()
    .filter((item) => item.slug !== entry.slug)
    .slice(0, 3);

  if (related.length === 0) return null;

  const readMore = t('common:caseStudy.readMore') as string;

  return (
    <section className={styles.section}>
      <Container padding="xl">
        <header className={styles.head}>
          <Text
            tag="p"
            variant="description_xs"
            color="primary"
            weight="semibold"
            delay={{ enter: 0.05, exit: 0 }}
            fadeUpTertiary
          >
            {t('common:caseStudy.relatedEyebrow') as string}
          </Text>
          <Text
            tag="h2"
            variant="title_small"
            color="secondary"
            weight="bold"
            delay={{ enter: 0.1, exit: 0 }}
            fadeUpTertiary
          >
            {t('common:caseStudy.relatedTitle') as string}
          </Text>
        </header>

        <div className={styles.grid}>
          {related.map((item, index) => (
            <WrapperMotion
              key={item.slug}
              className={styles.cell}
              delay={{ enter: 0.15 + index * 0.08, exit: 0.1 }}
            >
              <CaseStudyCard
                href={`/casos-de-exito/${item.slug}`}
                eyebrow={t(`${item.slug}:hero.eyebrow`) as string}
                title={t(`${item.slug}:hero.title`) as string}
                excerpt={t(`${item.slug}:card.excerpt`) as string}
                categories={
                  t(`${item.slug}:categories`, { returnObjects: true }) as string[]
                }
                cover={item.cover}
                coverAlt={t(`${item.slug}:hero.imageAlt`) as string}
                logo={item.logo}
                readMore={readMore}
              />
            </WrapperMotion>
          ))}
        </div>
      </Container>
    </section>
  );
};

export { CaseRelated };
