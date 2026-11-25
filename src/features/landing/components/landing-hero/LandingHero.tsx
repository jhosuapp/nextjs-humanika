import type { JSX } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { Container } from '@/src/features/home/components/container/Container';
import { Button } from '@/src/shared/components/button/Button';
import { CustomLink } from '@/src/shared/components/custom-link/CustomLink';
import { fadeUpMotion } from '@/src/shared/motion/fadeUp.motion';
import { pushDataLayer } from '@/src/shared/helpers/data-layer';

import styles from './landing-hero.module.css';

type LandingHeroProps = {
  t: ITranslations;
  namespace: string;
  demoUrl: string;
  secondaryHref: string;
};

// Same entrance/exit choreography as the home and product heroes.
const MOTION = {
  eyebrow: fadeUpMotion(0.52, 0.15),
  title: fadeUpMotion(0.53, 0.14),
  description: fadeUpMotion(0.55, 0.13),
  actions: fadeUpMotion(0.57, 0.12),
};

const LandingHero = ({
  t,
  namespace,
  demoUrl,
  secondaryHref,
}: LandingHeroProps): JSX.Element => {
  const reduce = useReducedMotion();

  return (
    <section className={styles.hero}>
      <div className={styles.orbs} aria-hidden="true">
        <motion.span
          className={`${styles.orb} ${styles.orbCyan}`}
          animate={reduce ? undefined : { x: [0, 24, 0], y: [0, -16, 0] }}
          transition={{ duration: 14, ease: 'easeInOut', repeat: Infinity }}
        />
        <motion.span
          className={`${styles.orb} ${styles.orbTeal}`}
          animate={reduce ? undefined : { x: [0, -28, 0], y: [0, 20, 0] }}
          transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity }}
        />
      </div>

      <Container className={styles.container}>
        <div className={styles.content}>
          <motion.p className={styles.eyebrow} {...MOTION.eyebrow}>
            <span className="gl-dot" aria-hidden="true" />
            {t('hero.eyebrow') as string}
          </motion.p>
          <motion.h1 className={styles.title} {...MOTION.title}>
            {t('hero.title') as string}
          </motion.h1>
          <motion.p className={styles.description} {...MOTION.description}>
            {t('hero.description') as string}
          </motion.p>
          <motion.div className={styles.actions} {...MOTION.actions}>
            <Button
              text={t('hero.primaryCta') as string}
              style="primary"
              type="button"
              iconRight={faWhatsapp}
              redirectTo={demoUrl}
              onClick={() => pushDataLayer({ event: 'demo_request_click', page: namespace })}
            />
            <CustomLink to={secondaryHref} className={styles.secondaryLink}>
              {t('hero.secondaryCta') as string}
              <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" />
            </CustomLink>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export { LandingHero };
