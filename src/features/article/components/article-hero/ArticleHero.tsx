import type { JSX } from 'react';
import Image from 'next/image';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { Text } from '@/src/shared/components/text/Text';
import { Container } from '@/src/features/home/components/container/Container';
import { WrapperMotion } from '@/src/shared/components/wrapper-motion/WrapperMotion';
import { ArticleMeta } from '@/src/features/article/components/article-meta/ArticleMeta';

import styles from './article-hero.module.css';

type ArticleHeroProps = {
  t: ITranslations;
  tKey?: string;
  image?: string;
};

const ArticleHero = ({ t, tKey = 'hero', image }: ArticleHeroProps): JSX.Element => {
  const lead = t(`${tKey}.lead`, { returnObjects: true }) as string[];

  return (
    <header className={styles.hero}>
      <Container padding="xl">
        <div className={styles.heroInner}>
          <Text
            tag="p"
            variant="description_xs"
            color="primary"
            weight="semibold"
            delay={{ enter: 0.53, exit: 0.14 }}
            immediate
          >
            {t(`${tKey}.eyebrow`) as string}
          </Text>

          <Text
            tag="h1"
            variant="title"
            color="secondary"
            weight="bold"
            delay={{ enter: 0.54, exit: 0.13 }}
            immediate
          >
            {t(`${tKey}.titleLead`) as string}
            <strong className="gl-degradete-text font-bold">
              {t(`${tKey}.titleAccent`) as string}
            </strong>
            {t(`${tKey}.titleTrail`) as string}
          </Text>

          <WrapperMotion
            className={styles.dividerWrap}
            delay={{ enter: 0.55, exit: 0.12 }}
            immediate
          >
            <span className={styles.divider} aria-hidden="true" />
          </WrapperMotion>

          <WrapperMotion delay={{ enter: 0.56, exit: 0.12 }} immediate>
            <ArticleMeta t={t} tKey={tKey} />
          </WrapperMotion>

          <div className={styles.lead}>
            {lead.map((paragraph, index) => {

              if(index > 1){
                return (
                  <></>
                )
              }

              return (
                <Text
                  key={index}
                  tag="p"
                  variant={'description'}
                  color="muted"
                  weight={index === 0 ? 'semibold' : 'normal'}
                  delay={{ enter: 0.57 + index * 0.01, exit: 0.11 }}
                  immediate
                >
                  {paragraph}
                </Text>
              )
            })}
          </div>
        </div>

        {image ? (
          <WrapperMotion
            className={styles.heroMediaWrap}
            delay={{ enter: 0.61, exit: 0.1 }}
            immediate
          >
            <figure className={styles.heroMedia}>
              <Image
                src={image}
                alt={t(`${tKey}.imageAlt`) as string}
                fill
                sizes="(max-width: 900px) 100vw, 56rem"
                className={styles.heroImage}
                priority
              />
              <span className={styles.heroOverlay} aria-hidden="true" />
            </figure>
          </WrapperMotion>
        ) : null}
      </Container>
    </header>
  );
};

export { ArticleHero };
