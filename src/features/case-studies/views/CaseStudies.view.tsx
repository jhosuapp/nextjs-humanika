import type { JSX } from 'react';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { Container } from '@/src/features/home/components/container/Container';
import { Text } from '@/src/shared/components/text/Text';
import { WrapperMotion } from '@/src/shared/components/wrapper-motion/WrapperMotion';
import { getSortedCaseStudies } from '@/src/features/case-studies/data/case-studies.registry';
import { CaseStudyCard } from '@/src/features/case-studies/components/case-study-card/CaseStudyCard';

import styles from './case-studies.module.css';
import { MetaPartner } from '@/src/shared/components/meta-partner/MetaPartner';

type CaseStudiesViewProps = { t: ITranslations };

// Cards are built from the registry; every visible string is resolved from the
// matching case namespace (loaded by pages/casos-de-exito/index.tsx), so the
// listing stays in sync with each case's own copy automatically.
const CaseStudiesView = ({ t }: CaseStudiesViewProps): JSX.Element => {
  const cases = getSortedCaseStudies();
  const readMore = t('card.readMore') as string;

  return (
    <div className={styles.page}>
      <Container padding="xl">
        <header className={styles.heading}>
          <Text
            tag="p"
            variant="description_xs"
            color="primary"
            weight="semibold"
            delay={{ enter: 0.53, exit: 0.14 }}
            immediate
          >
            {t('hero.eyebrow') as string}
          </Text>

          <Text
            tag="h1"
            variant="title"
            color="secondary"
            weight="bold"
            delay={{ enter: 0.54, exit: 0.13 }}
            immediate
          >
            {t('hero.title') as string}
          </Text>

          <Text
            tag="p"
            variant="description"
            color="muted"
            weight="normal"
            delay={{ enter: 0.56, exit: 0.12 }}
            immediate
          >
            {t('hero.description') as string}
          </Text>
        </header>

        <div className={styles.grid}>
          {cases.map((item, index) => {
            const ns = item.slug;

            return (
              <WrapperMotion
                key={ns}
                className={styles.gridItem}
                delay={{ enter: 0.5 + index * 0.08, exit: 0.1 }}
                immediate
              >
                <CaseStudyCard
                  href={`/casos-de-exito/${ns}`}
                  eyebrow={t(`${ns}:hero.eyebrow`) as string}
                  title={t(`${ns}:hero.title`) as string}
                  excerpt={t(`${ns}:card.excerpt`) as string}
                  categories={
                    t(`${ns}:categories`, { returnObjects: true }) as string[]
                  }
                  cover={item.cover}
                  coverAlt={t(`${ns}:hero.imageAlt`) as string}
                  logo={item.logo}
                  readMore={readMore}
                />
              </WrapperMotion>
            );
          })}
        </div>
      </Container>

      <MetaPartner />
    </div>
  );
};

export { CaseStudiesView };
