import type { JSX } from 'react';

import { Text } from '@/src/shared/components/text/Text';
import { Reveal } from '@/src/shared/components/motion/Reveal';

import styles from './article-section.module.css';

type InlineHighlightProps = {
  lead: string;
  term: string;
  trail: string;
};

const InlineHighlight = ({ lead, term, trail }: InlineHighlightProps): JSX.Element => (
  <Reveal>
    <Text tag="p" variant="description" color="muted" noMotion>
      {lead}
      <strong className={styles.highlight}>{term}</strong>
      {trail}
    </Text>
  </Reveal>
);

export { InlineHighlight };
