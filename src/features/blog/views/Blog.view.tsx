import type { JSX } from 'react';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { Container } from '@/src/features/home/components/container/Container';
import { Text } from '@/src/shared/components/text/Text';
import { WrapperMotion } from '@/src/shared/components/wrapper-motion/WrapperMotion';
import { getSortedArticles } from '@/src/features/article/data/articles.registry';
import { ArticleCard } from '@/src/features/blog/components/article-card/ArticleCard';

import styles from './blog.module.css';

type BlogViewProps = { t: ITranslations };

// Cards are built from the registry; every visible string is resolved from the
// matching article namespace (loaded by pages/blog/index.tsx), so the listing
// stays in sync with each article's own copy automatically.
const BlogView = ({ t }: BlogViewProps): JSX.Element => {
  const articles = getSortedArticles();
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
          {articles.map((article, index) => {
            const ns = article.slug;
            const lead = t(`${ns}:hero.lead`, {
              returnObjects: true,
            }) as string[];

            return (
              <WrapperMotion
                key={ns}
                className={styles.gridItem}
                delay={{ enter: 0.50 + index * 0.08, exit: 0.1 }}
                immediate
              >
                <ArticleCard
                  href={`/blog/${ns}`}
                  eyebrow={t(`${ns}:hero.eyebrow`) as string}
                  titleLead={t(`${ns}:hero.titleLead`) as string}
                  titleAccent={t(`${ns}:hero.titleAccent`) as string}
                  titleTrail={t(`${ns}:hero.titleTrail`) as string}
                  excerpt={lead[0] ?? ''}
                  readingTime={t(`${ns}:hero.meta.readingTime`) as string}
                  date={t(`${ns}:hero.meta.date`) as string}
                  cover={article.cover}
                  coverAlt={t(`${ns}:hero.imageAlt`) as string}
                  readMore={readMore}
                />
              </WrapperMotion>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export { BlogView };
