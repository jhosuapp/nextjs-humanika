import type { JSX } from 'react';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { Text } from '@/src/shared/components/text/Text';
import { Reveal } from '@/src/shared/components/motion/Reveal';

import styles from './key-takeaways.module.css';

type KeyTakeawaysProps = { t: ITranslations; tKey?: string };

const KeyTakeaways = ({ t, tKey = 'takeaways' }: KeyTakeawaysProps): JSX.Element => {
  const items = t(`${tKey}.items`, { returnObjects: true }) as string[];

  return (
    <Reveal as="aside" className={styles.card}>
      <div className={styles.glow} aria-hidden="true" />
      <Text
        className={styles.title}
        tag="h2"
        variant="subtitle_small"
        color="secondary"
        weight="bold"
        noMotion
      >
        {t(`${tKey}.title`) as string}
      </Text>

      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={index} className={styles.item}>
            <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
            <span className={styles.text}>{item}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
};

export { KeyTakeaways };
