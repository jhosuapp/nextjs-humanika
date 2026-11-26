import type { JSX } from 'react';

import { Text } from '@/src/shared/components/text/Text';
import { Reveal } from '@/src/shared/components/motion/Reveal';

import styles from './article-section.module.css';

type EmphasisLineProps = { text: string };

const EmphasisLine = ({ text }: EmphasisLineProps): JSX.Element => (
  <Reveal>
    <Text
      className={styles.emphasis}
      tag="p"
      variant="subtitle_small"
      color="secondary"
      weight="semibold"
      noMotion
    >
      {text}
    </Text>
  </Reveal>
);

export { EmphasisLine };
