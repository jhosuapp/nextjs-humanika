import type { JSX } from 'react';
import Image from 'next/image';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import type { CaseStudyEntry } from '@/src/features/case-studies/types/case-study.types';
import { Container } from '@/src/features/home/components/container/Container';
import { Text } from '@/src/shared/components/text/Text';
import { WrapperMotion } from '@/src/shared/components/wrapper-motion/WrapperMotion';
import { ArticleCta } from '@/src/features/article/components/article-cta/ArticleCta';

import styles from './case-study-detail.module.css';

type CaseStudyDetailViewProps = {
  t: ITranslations;
  entry: CaseStudyEntry;
};

const HIGHLIGHT_KEYS = ['challenge', 'solution', 'result'] as const;

const CaseStudyDetailView = ({
  t,
  entry,
}: CaseStudyDetailViewProps): JSX.Element => {
  const categories = t('categories', { returnObjects: true }) as string[];
  const paragraphs = t('overview.paragraphs', {
    returnObjects: true,
  }) as string[];

  return (
    <div className={styles.page}>
      <Container padding="xl">
        <header className={styles.hero}>
          <Text
            className={styles.eyebrow}
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
            className={styles.title}
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
            className={styles.description}
            tag="p"
            variant="subtitle_small"
            color="muted"
            weight="normal"
            delay={{ enter: 0.56, exit: 0.12 }}
            immediate
          >
            {t('hero.description') as string}
          </Text>

          <WrapperMotion delay={{ enter: 0.58, exit: 0.11 }} immediate>
            <ul className={styles.tags}>
              {categories.map((category) => (
                <li key={category} className={styles.tag}>
                  {category}
                </li>
              ))}
            </ul>
          </WrapperMotion>
        </header>

        <WrapperMotion
          className={styles.mediaWrap}
          delay={{ enter: 0.61, exit: 0.1 }}
          immediate
        >
          <figure className={styles.media}>
            <Image
              src={entry.cover}
              alt={t('hero.imageAlt') as string}
              fill
              sizes="(max-width: 900px) 100vw, 56rem"
              className={styles.image}
              priority
            />
            <span className={styles.mediaOverlay} aria-hidden="true" />
          </figure>
        </WrapperMotion>

        <div className={styles.body}>
          <div className={styles.overview}>
            {paragraphs.map((paragraph, index) => (
              <Text
                key={index}
                tag="p"
                variant="description"
                color="muted"
                weight="normal"
                delay={{ enter: 0.5, exit: 0.1 }}
              >
                {paragraph}
              </Text>
            ))}
          </div>

          <div className={styles.highlights}>
            {HIGHLIGHT_KEYS.map((key, index) => (
              <WrapperMotion
                key={key}
                className="h-full"
                classNameSecondary="h-full"
                delay={{ enter: 0.5 + index * 0.08, exit: 0.1 }}
              >
                <div className={`${styles.highlight} gl-gradient-box`}>
                  <span className={styles.highlightLabel}>
                    {t(`highlights.${key}.label`) as string}
                  </span>
                  <p className={styles.highlightText}>
                    {t(`highlights.${key}.text`) as string}
                  </p>
                </div>
              </WrapperMotion>
            ))}
          </div>

          <ArticleCta t={t} tKey="cta" />
        </div>
      </Container>
    </div>
  );
};

export { CaseStudyDetailView };
