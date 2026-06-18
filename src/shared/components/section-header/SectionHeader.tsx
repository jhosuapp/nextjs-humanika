import type { ReactNode } from 'react';

import { FadeIn } from '@/src/shared/components/motion/FadeIn';
import { Text } from '@/src/shared/components/text/Text';
import { revealDelay } from '@/src/shared/helpers/motion-variants';

type SectionHeaderProps = {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Wrapper (FadeIn) class — owns the section head layout/spacing. */
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  /** Initial Y offset for the wrapper reveal (defaults to FadeIn's own). */
  y?: number;
};

/**
 * Shared section header: the eyebrow → title → description cascade reused
 * across home sections and feature views. Typography (variant/colour/weight)
 * and the reveal timing are fixed here so every section stays in lockstep;
 * layout stays with each consumer through the `*ClassName` props.
 */
const SectionHeader = ({
  eyebrow,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  y,
}: SectionHeaderProps) => (
  <FadeIn className={className} y={y}>
    <Text
      tag="p"
      variant="description_xs"
      color="primary"
      weight="semibold"
      delay={{ enter: revealDelay(0), exit: 0 }}
      fadeUpTertiary
    >
      {eyebrow}
    </Text>
    <Text
      className={titleClassName}
      tag="h2"
      variant="title_small"
      color="secondary"
      weight="semibold"
      delay={{ enter: revealDelay(1), exit: 0 }}
      fadeUpTertiary
    >
      {title}
    </Text>
    {description ? (
      <Text
        className={descriptionClassName}
        tag="p"
        variant="description"
        color="muted"
        delay={{ enter: revealDelay(2), exit: 0 }}
        fadeUpTertiary
      >
        {description}
      </Text>
    ) : null}
  </FadeIn>
);

export { SectionHeader };
