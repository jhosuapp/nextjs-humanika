import Image from 'next/image';

import { FadeIn } from '@/src/shared/components/motion/FadeIn';
import {
  StaggerGroup,
  StaggerItem,
} from '@/src/shared/components/motion/StaggerGroup';
import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { homeStaticData } from '@/src/features/home/data/home-content';
import { Spotlight } from '@/src/shared/components/spotlight/Spotlight';
import { REVEAL, revealDelay } from '@/src/shared/helpers/motion-variants';

import styles from './integrations-grid.module.css';
import { Container } from '../container/Container';
import { Text } from '@/src/shared/components/text/Text';

type IntegrationsGridProps = { t: ITranslations };

const IntegrationsGrid = ({ t }: IntegrationsGridProps) => {
  const { integrations } = homeStaticData;

  return (
    <section className={styles.section} aria-labelledby="integrations-title">
      <Container padding='xl'>
        <FadeIn className={styles.head}>
          <Text
            tag="p"
            variant="description_xs"
            color="primary"
            weight="semibold"
            delay={{ enter: revealDelay(0), exit: 0 }}
            fadeUpTertiary
          >
            {t('integrations.eyebrow')}
          </Text>
          <Text
            className={styles.title}
            tag="h2"
            variant="title_small"
            color="secondary"
            weight="semibold"
            delay={{ enter: revealDelay(1), exit: 0 }}
            fadeUpTertiary
          >
            {t('integrations.title')}
          </Text>
          <Text
            className={styles.description}
            tag="p"
            variant="description"
            color="muted"
            delay={{ enter: revealDelay(2), exit: 0 }}
            fadeUpTertiary
          >
            {t('integrations.description')}
          </Text>
        </FadeIn>

        <StaggerGroup className={styles.grid} stagger={REVEAL.stagger} amount={REVEAL.amount}>
          {integrations.logos.map((logo) => (
            <StaggerItem key={logo.name}>
              <div className={`${styles.tile} gl-gradient-box`}>
                <Spotlight size={200} color="rgba(0, 177, 215, 0.14)" />
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={48}
                  height={48}
                  unoptimized
                  className={styles.logo}
                />
                <Text
                  tag="p" 
                  variant="description_small" 
                  color="muted"
                  delay={{ enter: revealDelay(1), exit: 0 }}
                  fadeUpTertiary
                  immediate
                >
                  {logo.name}
                </Text>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
};

export { IntegrationsGrid };