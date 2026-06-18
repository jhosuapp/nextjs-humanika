import type { JSX, ReactNode } from 'react';

import { Text } from '@/src/shared/components/text/Text';
import { Reveal } from '@/src/features/article/components/reveal/Reveal';

import styles from './article-section.module.css';

type ArticleSectionProps = {
  title: string;
  children: ReactNode;
  id?: string;
  index?: string;
  eyebrow?: string;
};

const ArticleSection = ({
  title,
  children,
  id,
  index,
  eyebrow,
}: ArticleSectionProps): JSX.Element => (
  <section id={id} className={styles.section}>
    <Reveal className={styles.heading}>
      {index || eyebrow ? (
        <span className={styles.kicker}>
          {index ? <span className={styles.index}>{index}</span> : null}
          {eyebrow ? <span className="gl-eyebrow">{eyebrow}</span> : null}
        </span>
      ) : null}

      <Text
        className={styles.title}
        tag="h2"
        variant="title_small"
        color="secondary"
        weight="bold"
        noMotion
      >
        {title}
      </Text>
    </Reveal>
    {children}
  </section>
);

export { ArticleSection };
