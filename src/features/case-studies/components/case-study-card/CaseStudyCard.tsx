import type { JSX } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';

import { CustomLink } from '@/src/shared/components/custom-link/CustomLink';
import { Text } from '@/src/shared/components/text/Text';

import styles from './case-study-card.module.css';

type CaseStudyCardProps = {
  href: string;
  eyebrow: string;
  title: string;
  excerpt: string;
  categories: string[];
  cover: string;
  coverAlt: string;
  logo: string;
  readMore: string;
};

const CaseStudyCard = ({
  href,
  eyebrow,
  title,
  excerpt,
  categories,
  cover,
  coverAlt,
  logo,
  readMore,
}: CaseStudyCardProps): JSX.Element => {
  return (
    <CustomLink to={href} className={`${styles.card} gl-gradient-box gl-card`}>
      <figure className={styles.media}>
        <Image
          src={cover}
          alt={coverAlt}
          fill
          sizes="(max-width: 700px) 100vw, 22rem"
          className={styles.image}
        />
        <span className={styles.overlay} aria-hidden="true" />
        <span className={styles.logoBadge}>
          <Image
            src={logo}
            alt=""
            width={88}
            height={28}
            unoptimized
            className={styles.logo}
          />
        </span>
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
          {title}
        </Text>

        <Text
          className={styles.excerpt}
          tag="p"
          variant="description_small"
          color="muted"
          weight="normal"
          immediate
          fadeUpTertiary
        >
          {excerpt}
        </Text>

        <ul className={styles.tags}>
          {categories.map((category) => (
            <li key={category} className={styles.tag}>
              {category}
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
          <span className={styles.readMore}>
            {readMore}
            <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" />
          </span>
        </div>
      </div>
    </CustomLink>
  );
};

export { CaseStudyCard };
