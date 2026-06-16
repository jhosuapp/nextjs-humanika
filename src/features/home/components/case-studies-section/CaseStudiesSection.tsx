import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

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
import styles from './case-studies-section.module.css';
import { fadeUpTertiaryMotion } from '@/src/shared/motion/fadeUp.motion';
import { REVEAL, revealDelay } from '@/src/shared/helpers/motion-variants';
import { WrapperMotion } from '@/src/shared/components/wrapper-motion/WrapperMotion';

type CaseStudiesSectionProps = { t: ITranslations };

const CaseStudiesSection = ({ t }: CaseStudiesSectionProps) => {
  const reduce = useReducedMotion();
  const { caseStudies } = homeStaticData;

  return (
    <section className={styles.section} aria-labelledby="case-studies-title">
      <Container padding="xl">
        <FadeIn className={styles.head}>
          <Text
            tag="p"
            variant="description_xs"
            color="primary"
            weight="semibold"
            delay={{ enter: revealDelay(0), exit: 0 }}
            fadeUpTertiary
          >
            {t('caseStudies.eyebrow')}
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
            {t('caseStudies.title')}
          </Text>
          <Text
            className={styles.description}
            tag="p"
            variant="description"
            color="muted"
            delay={{ enter: revealDelay(2), exit: 0 }}
            fadeUpTertiary
          >
            {t('caseStudies.description')}
          </Text>
        </FadeIn>

        <StaggerGroup className={styles.grid} stagger={REVEAL.stagger} amount={REVEAL.amount}>
          {caseStudies.items.map((item) => (
            <WrapperMotion fadeUpTertiary delay={{ enter: 0, exit: 0 }} classNameSecondary='h-full'>
              <StaggerItem key={item.id} className={styles.cell}>
                <motion.article
                  className={styles.card}
                  whileHover={reduce ? undefined : { y: -4 }}
                  {...fadeUpTertiaryMotion(0,0)}
                >
                  <Spotlight size={220} color="rgba(0, 177, 215, 0.12)" />
                  <span className={styles.accent} aria-hidden="true" />
                  <div className={styles.cardHead}>
                    {item.logo ? (
                      <Image
                        src={item.logo}
                        alt=""
                        width={96}
                        height={32}
                        unoptimized
                        className={styles.logo}
                      />
                    ) : (
                      <span className={styles.iconWrap} aria-hidden="true">
                        <FontAwesomeIcon icon={item.icon} className={styles.icon} />
                      </span>
                    )}
                    <span className={styles.industry}>
                      {t(`caseStudies.items.${item.id}.industry`)}
                    </span>
                  </div>

                  {item.count ? (
                    <AnimatedCounter
                      className={styles.metric}
                      to={item.count.to}
                      decimals={item.count.decimals ?? 0}
                      prefix={t(`caseStudies.items.${item.id}.prefix`) as string}
                      suffix={t(`caseStudies.items.${item.id}.suffix`) as string}
                    />
                  ) : (
                    <span className={styles.metric}>
                      {t(`caseStudies.items.${item.id}.metric`)}
                    </span>
                  )}

                  <h3 className={styles.cardTitle}>
                    {t(`caseStudies.items.${item.id}.title`)}
                  </h3>
                  <p className={styles.cardDescription}>
                    {t(`caseStudies.items.${item.id}.description`)}
                  </p>

                  <span className={styles.arrow} aria-hidden="true">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </span>
                </motion.article>
              </StaggerItem>
            </WrapperMotion>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
};

export { CaseStudiesSection };
