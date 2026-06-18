import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  StaggerGroup,
  StaggerItem,
} from '@/src/shared/components/motion/StaggerGroup';
import { AnimatedCounter } from '@/src/shared/components/motion/AnimatedCounter';
import { Spotlight } from '@/src/shared/components/spotlight/Spotlight';
import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { homeStaticData } from '@/src/features/home/data/home-content';

import { Container } from '../container/Container';
import { SectionHeader } from '@/src/shared/components/section-header/SectionHeader';
import styles from './stats-section.module.css';

type StatsSectionProps = { t: ITranslations };

const StatsSection = ({ t }: StatsSectionProps) => {
  const { stats } = homeStaticData;

  return (
    <section className={styles.section} aria-labelledby="stats-title">
      <Container padding="xl">
        <SectionHeader
          className={styles.head}
          titleClassName={styles.title}
          eyebrow={t('stats.eyebrow')}
          title={t('stats.title')}
        />

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
