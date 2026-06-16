import type { JSX } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';

import { CustomLink } from '@/src/shared/components/custom-link/CustomLink';

import styles from './article-card.module.css';
import { Text } from '@/src/shared/components/text/Text';

type ArticleCardProps = {
  href: string;
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  titleTrail: string;
  excerpt: string;
  readingTime: string;
  date: string;
  cover: string;
  coverAlt: string;
  readMore: string;
};

const ArticleCard = ({
  href,
  eyebrow,
  titleLead,
  titleAccent,
  titleTrail,
  excerpt,
  readingTime,
  date,
  cover,
  coverAlt,
  readMore,
}: ArticleCardProps): JSX.Element => {
  return (
    <CustomLink to={href} className={`${styles.card} gl-gradient-box`}>
      <figure className={styles.media}>
        <Image
          src={cover}
          alt={coverAlt}
          fill
          sizes="(max-width: 700px) 100vw, 22rem"
          className={styles.image}
        />
        <span className={styles.overlay} aria-hidden="true" />
      </figure>

      <div className={styles.body}>
        <Text
          tag="p"
          variant="description_xs"
          color="primary"
          weight="semibold"
          immediate
          fadeUpTertiary
        >
          {eyebrow}
        </Text>

        <Text
          className={styles.title}
          tag="h2"
          variant="subtitle_small"
          color="secondary"
          weight="normal"
          immediate
          fadeUpTertiary
        >
          {titleLead}
          <strong className="gl-degradete-text font-bold">{titleAccent}</strong>
          {titleTrail}
        </Text>

        <Text
          className={ styles.excerpt }
          tag="p"
          variant="description_small"
          color="muted"
          weight="normal"
          immediate
          fadeUpTertiary
        >
          {excerpt}
        </Text>

        <div className={styles.footer}>
          <p className={styles.meta}>
            <span>{date}</span>
            <span className={styles.dot} aria-hidden="true" />
            <span>{readingTime}</span>
          </p>

          <span className={styles.readMore}>
            {readMore}
            <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" />
          </span>
        </div>
      </div>
    </CustomLink>
  );
};

export { ArticleCard };
