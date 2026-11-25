import type { JSX } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';

import { CustomLink } from '@/src/shared/components/custom-link/CustomLink';

import styles from './product-card.module.css';

type ProductCardProps = {
  href: string;
  image: string;
  imageAlt: string;
  category: string;
  title: string;
  line: string;
  cta: string;
};

const ProductCard = ({
  href,
  image,
  imageAlt,
  category,
  title,
  line,
  cta,
}: ProductCardProps): JSX.Element => (
  <CustomLink to={href} className={`${styles.card} gl-gradient-box gl-card`}>
    <figure className={styles.media}>
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, 26rem"
        className={styles.image}
      />
      <span className={styles.overlay} aria-hidden="true" />
      <span className={styles.category}>{category}</span>
    </figure>

    <div className={styles.body}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.line}>{line}</p>
      <span className={styles.cta}>
        {cta}
        <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" />
      </span>
    </div>
  </CustomLink>
);

export { ProductCard };
