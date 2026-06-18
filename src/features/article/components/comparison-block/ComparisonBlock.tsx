import type { JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { Text } from '@/src/shared/components/text/Text';
import {
  Reveal,
  RevealGroup,
  RevealItem,
} from '@/src/features/article/components/reveal/Reveal';

import styles from './comparison-block.module.css';

type ComparisonBlockProps = {
  t: ITranslations;
  tKey: string;
  id?: string;
};

const ComparisonBlock = ({ t, tKey, id }: ComparisonBlockProps): JSX.Element => {
  const left = t(`${tKey}.left.items`, { returnObjects: true }) as string[];
  const right = t(`${tKey}.right.items`, { returnObjects: true }) as string[];

  return (
    <section id={id} className={styles.section}>
      <Reveal className={styles.header}>
        <Text
          tag="p"
          variant="description_xs"
          color="primary"
          weight="semibold"
          noMotion
        >
          {t(`${tKey}.eyebrow`) as string}
        </Text>
        <Text tag="h2" variant="title_small" color="secondary" weight="bold" noMotion>
          {t(`${tKey}.title`) as string}
        </Text>
      </Reveal>

      <RevealGroup className={styles.grid}>
        <RevealItem className={`${styles.card} ${styles.cardMuted}`}>
          <p className="gl-eyebrow">{t(`${tKey}.left.label`) as string}</p>
          <ul className={styles.list}>
            {left.map((item) => (
              <li key={item} className={styles.item}>
                <FontAwesomeIcon
                  icon={faXmark}
                  className={styles.iconNeg}
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </RevealItem>

        <RevealItem className={`${styles.card} ${styles.cardAccent}`}>
          <div className={styles.cardGlow} aria-hidden="true" />
          <p className="gl-eyebrow-accent">{t(`${tKey}.right.label`) as string}</p>
          <ul className={styles.list}>
            {right.map((item) => (
              <li key={item} className={styles.item}>
                <FontAwesomeIcon
                  icon={faCheck}
                  className={styles.iconPos}
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </RevealItem>
      </RevealGroup>
    </section>
  );
};

export { ComparisonBlock };
