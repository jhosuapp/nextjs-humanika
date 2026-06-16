import Image from 'next/image';

import { FadeIn } from '@/src/shared/components/motion/FadeIn';
import { Marquee } from '@/src/shared/components/motion/Marquee';
import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { homeStaticData } from '@/src/features/home/data/home-content';
import { Container } from '../container/Container';
import { Text } from '@/src/shared/components/text/Text';
import { revealDelay } from '@/src/shared/helpers/motion-variants';

import styles from './trusted-by-strip.module.css';
import { WrapperMotion } from '@/src/shared/components/wrapper-motion/WrapperMotion';

type TrustedByStripProps = { t: ITranslations };

const ROW_DIRECTIONS = ['left', 'right'] as const;
const ROW_SPEEDS = [28, 32] as const;

const TrustedByStrip = ({ t }: TrustedByStripProps) => {
  const label = t('trustedBy.label') as string;
  const rows = homeStaticData.trustedBy.rows;

  return (
    <Container className={styles.section} padding="xl" aria-label={label}>
      <FadeIn y={8} duration="fast">
        <Text
          tag="p"
          variant="description_xs"
          color="primary"
          weight="semibold"
          delay={{ enter: revealDelay(0), exit: 0 }}
          fadeUpTertiary
        >
          {label}
        </Text>
      </FadeIn>
      <WrapperMotion delay={{ enter: revealDelay(1), exit: 0 }} fadeUpTertiary>
        <div className={styles.rows}>
          {rows.map((row, rowIndex) => (
            <Marquee
              key={rowIndex}
              className={styles.marquee}
              speed={ROW_SPEEDS[rowIndex] ?? 30}
              direction={ROW_DIRECTIONS[rowIndex] ?? 'left'}
              pauseOnHover={false}
              scrollBoost
            >
              {row.map((logo) => (
                <div key={logo.name} className={styles.logo}>
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={120}
                    height={48}
                    className={styles.logoImg}
                  />
                </div>
              ))}
            </Marquee>
          ))}
        </div>
      </WrapperMotion>
    </Container>
  );
};

export { TrustedByStrip };
