import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FadeIn } from '@/src/shared/components/motion/FadeIn';
import {
  StaggerGroup,
  StaggerItem,
} from '@/src/shared/components/motion/StaggerGroup';
import { AnimatedCounter } from '@/src/shared/components/motion/AnimatedCounter';
import { Spotlight } from '@/src/shared/components/spotlight/Spotlight';
import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { homeStaticData } from '@/src/features/home/data/home-content';

import { Container } from '../container/Container';
import { Text } from '@/src/shared/components/text/Text';
import styles from './stats-section.module.css';

type StatsSectionProps = { t: ITranslations };

const StatsSection = ({ t }: StatsSectionProps) => {
  const { stats } = homeStaticData;

  return (
    <section className={styles.section} aria-labelledby="stats-title">
      <Container padding="xl">
        <FadeIn className={styles.head}>
          <Text
            tag="p"
            variant="description_xs"
            color="primary"
            weight="semibold"
            delay={{ enter: 0.05, exit: 0 }}
            fadeUpTertiary
          >
            {t('stats.eyebrow')}
          </Text>
          <Text
            className={styles.title}
            tag="h2"
            variant="title_small"
            color="secondary"
            weight="semibold"
            delay={{ enter: 0.1, exit: 0 }}
            fadeUpTertiary
          >
            {t('stats.title')}
          </Text>
        </FadeIn>

        <StaggerGroup className={styles.grid} stagger={0.1} amount={0.3}>
          {stats.items.map((item) => (
            <StaggerItem key={item.id} className={styles.cell}>
              <div className={styles.card}>
                <Spotlight size={260} />
                <span className={styles.iconWrap} aria-hidden="true">
                  <FontAwesomeIcon icon={item.icon} className={styles.icon} />
                </span>
                <AnimatedCounter
                  className={styles.value}
                  to={item.to}
                  decimals={item.decimals ?? 0}
                  prefix={t(`stats.items.${item.id}.prefix`) as string}
                  suffix={t(`stats.items.${item.id}.suffix`) as string}
                />
                <span className={styles.label}>
                  {t(`stats.items.${item.id}.label`)}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
};

export { StatsSection };
