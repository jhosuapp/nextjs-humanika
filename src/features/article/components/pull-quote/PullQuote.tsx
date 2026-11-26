import type { JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

import { Reveal } from '@/src/shared/components/motion/Reveal';

import styles from './pull-quote.module.css';

type PullQuoteProps = {
  quote: string;
  accent?: string;
};

const PullQuote = ({ quote, accent }: PullQuoteProps): JSX.Element => (
  <Reveal as="blockquote" className={styles.quote}>
    <FontAwesomeIcon
      icon={faQuoteLeft}
      className={styles.mark}
      aria-hidden="true"
    />
    <p className={styles.text}>{quote}</p>
    {accent ? (
      <span className={`${styles.accent} gl-degradete-text`}>{accent}</span>
    ) : null}
  </Reveal>
);

export { PullQuote };
