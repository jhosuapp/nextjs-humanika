import type { JSX } from 'react';

import { Text } from '@/src/shared/components/text/Text';
import { RevealGroup, RevealItem } from '@/src/shared/components/motion/Reveal';

type ArticleParagraphsProps = { items: string[] };

const ArticleParagraphs = ({ items }: ArticleParagraphsProps): JSX.Element => (
  <RevealGroup className="flex flex-col gap-4">
    {items.map((paragraph, index) => (
      <RevealItem key={index}>
        <Text tag="p" variant="description" color="muted" noMotion>
          {paragraph}
        </Text>
      </RevealItem>
    ))}
  </RevealGroup>
);

export { ArticleParagraphs };
