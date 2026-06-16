import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowRightLong } from '@fortawesome/free-solid-svg-icons';

import { FadeIn } from '@/src/shared/components/motion/FadeIn';
import {
  StaggerGroup,
  StaggerItem,
} from '@/src/shared/components/motion/StaggerGroup';
import { AnimatedCounter } from '@/src/shared/components/motion/AnimatedCounter';
import { Spotlight } from '@/src/shared/components/spotlight/Spotlight';
import { CustomLink } from '@/src/shared/components/custom-link/CustomLink';
import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { getSortedCaseStudies } from '@/src/features/case-studies/data/case-studies.registry';

import { Container } from '../container/Container';
import { Text } from '@/src/shared/components/text/Text';
import styles from './case-studies-section.module.css';
import { fadeUpTertiaryMotion } from '@/src/shared/motion/fadeUp.motion';
import { REVEAL, revealDelay } from '@/src/shared/helpers/motion-variants';
import { WrapperMotion } from '@/src/shared/components/wrapper-motion/WrapperMotion';

type CaseStudiesSectionProps = { t: ITranslations };

const CaseStudiesSection = ({ t }: CaseStudiesSectionProps) => {
  const reduce = useReducedMotion();
  const caseStudies = getSortedCaseStudies();

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
          {caseStudies.map((item) => {
            const ns = item.slug;

            return (
              <WrapperMotion key={ns} fadeUpTertiary delay={{ enter: 0, exit: 0 }} classNameSecondary='h-full'>
                <StaggerItem className={styles.cell}>
                  <CustomLink to={`/casos-de-exito/${ns}`} className={styles.cardLink}>
                    <motion.article
                      className={`${styles.card} gl-gradient-box`}
                      whileHover={reduce ? undefined : { y: -4 }}
                      {...fadeUpTertiaryMotion(0, 0)}
                    >
                      <Spotlight size={240} color="rgba(0, 177, 215, 0.1)" />
                      <span className={styles.accent} aria-hidden="true" />

                      <header className={styles.cardHead}>
                        <span className={styles.logoChip}>
                          <Image
                            src={item.logo}
                            alt=""
                            width={84}
                            height={24}
                            unoptimized
                            className={styles.logo}
                          />
                        </span>
                        <span className={styles.industry}>
                          {t(`${ns}:hero.eyebrow`)}
                        </span>
                      </header>

                      <div className={styles.cardBody}>
                        <h3 className={styles.cardTitle}>
                          {t(`${ns}:card.title`)}
                        </h3>
                        <p className={styles.cardDescription}>
                          {t(`${ns}:card.excerpt`)}
                        </p>
                      </div>

                      <footer className={styles.cardFoot}>
                        {item.count ? (
                          <AnimatedCounter
                            className={styles.metric}
                            to={item.count.to}
                            decimals={item.count.decimals ?? 0}
                            prefix={t(`${ns}:metric.prefix`) as string}
                            suffix={t(`${ns}:metric.suffix`) as string}
                          />
                        ) : (
                          <span className={styles.metric}>
                            {t(`${ns}:metric.value`)}
                          </span>
                        )}

                        <span className={styles.cta}>
                          {t('caseStudies.cardCta')}
                          <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
                        </span>
                      </footer>
                    </motion.article>
                  </CustomLink>
                </StaggerItem>
              </WrapperMotion>
            );
          })}
        </StaggerGroup>

        <FadeIn className={styles.footer}>
          <CustomLink to="/casos-de-exito" className={styles.viewAll}>
            {t('caseStudies.viewAll')}
            <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" />
          </CustomLink>
        </FadeIn>
      </Container>
    </section>
  );
};

export { CaseStudiesSection };
