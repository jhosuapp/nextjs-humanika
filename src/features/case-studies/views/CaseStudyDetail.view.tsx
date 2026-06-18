import type { JSX } from 'react';
import Image from 'next/image';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import type { CaseStudyEntry } from '@/src/features/case-studies/types/case-study.types';
import { Container } from '@/src/features/home/components/container/Container';
import { Text } from '@/src/shared/components/text/Text';
import { WrapperMotion } from '@/src/shared/components/wrapper-motion/WrapperMotion';
import { ArticleCta } from '@/src/features/article/components/article-cta/ArticleCta';
import { ArticleRenderer } from '@/src/features/article/renderer/ArticleRenderer';

import styles from './case-study-detail.module.css';
import { Reveal } from '../../article/components/reveal/Reveal';
import { CaseRelated } from '../components/detail/CaseRelated';

type CaseStudyDetailViewProps = {
  t: ITranslations;
  entry: CaseStudyEntry;
};

const HIGHLIGHT_KEYS = ['challenge', 'solution', 'result'] as const;

const CaseStudyDetailView = ({
  t,
  entry,
}: CaseStudyDetailViewProps): JSX.Element => {
  // Rich cases carry a block schema and render with the article renderer
  // (blog-style layout); the related-cases section is appended below it.
  if (entry.content) {
    return (
      <>
        <ArticleRenderer t={t} content={entry.content} />
        <CaseRelated t={t} entry={entry} />
      </>
    );
  }

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
              <Reveal key={index}>
                <Text
                  tag="p"
                  variant="description"
                  color="muted"
                  weight="normal"
                  delay={{ enter: 0, exit: 0.1 }}
                  immediate
                >
                  {paragraph}
                </Text>
              </Reveal>
            ))}
          </div>

          <div className={styles.highlights}>
            {HIGHLIGHT_KEYS.map((key) => (
              <Reveal
                key={key}
                className="h-full"
              >
                <div className={`${styles.highlight} gl-gradient-box`}>
                  <span className="gl-eyebrow-accent">
                    {t(`highlights.${key}.label`) as string}
                  </span>
                  <p className={styles.highlightText}>
                    {t(`highlights.${key}.text`) as string}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <ArticleCta t={t} tKey="cta" />
        </div>
      </Container>

      <CaseRelated t={t} entry={entry} />
    </div>
  );
};

export { CaseStudyDetailView };
