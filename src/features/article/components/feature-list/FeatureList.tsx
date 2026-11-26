import type { JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import { RevealGroup, RevealItem } from '@/src/shared/components/motion/Reveal';

import styles from './feature-list.module.css';

type FeatureListProps = { items: string[] };

const FeatureList = ({ items }: FeatureListProps): JSX.Element => (
  <RevealGroup className={styles.grid}>
    {items.map((item) => (
      <RevealItem key={item} className={styles.item}>
        <FontAwesomeIcon
          icon={faCircleCheck}
          className={styles.icon}
          aria-hidden="true"
        />
        <span className={styles.text}>{item}</span>
      </RevealItem>
    ))}
  </RevealGroup>
);

export { FeatureList };
