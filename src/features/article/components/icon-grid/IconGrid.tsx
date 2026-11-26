import type { JSX } from 'react';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { motion, useReducedMotion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { Text } from '@/src/shared/components/text/Text';
import {
  Reveal,
  RevealGroup,
  RevealItem,
} from '@/src/shared/components/motion/Reveal';

import styles from './icon-grid.module.css';

type IconGridItem = { key: string; icon: IconDefinition };

type IconGridProps = {
  t: ITranslations;
  tKey: string;
  items: ReadonlyArray<IconGridItem>;
  id?: string;
};

const IconGrid = ({ t, tKey, items, id }: IconGridProps): JSX.Element => {
  const reduce = useReducedMotion();

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
        <Text tag="p" variant="description" color="muted" noMotion>
          {t(`${tKey}.description`) as string}
        </Text>
      </Reveal>

      <RevealGroup className={styles.grid}>
        {items.map((item) => (
          <RevealItem key={item.key}>
            <motion.div
              className={styles.tile}
              whileHover={reduce ? undefined : { y: -3, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className={styles.icon}
                aria-hidden="true"
              />
              <span className={styles.label}>
                {t(`${tKey}.items.${item.key}`) as string}
              </span>
            </motion.div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
};

export { IconGrid };
export type { IconGridItem };
