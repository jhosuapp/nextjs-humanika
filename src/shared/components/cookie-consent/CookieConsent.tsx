import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { useEffect, type JSX } from 'react';

import { EASE } from '@/src/shared/helpers/motion-variants';
import { useCookieConsentStore } from '@/src/shared/stores/cookie-consent.store';
import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { CustomLink } from '@/src/shared/components/custom-link/CustomLink';

import styles from './cookie-consent.module.css';

type CookieConsentProps = { t: ITranslations };

const CookieConsent = ({ t }: CookieConsentProps): JSX.Element => {
  const { status, hydrated, accept, decline, hydrate } = useCookieConsentStore();
  const reduce = useReducedMotion();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const easeOut: [number, number, number, number] = [0.4, 0, 1, 1];

  const bannerVariants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE, delay: 5 },
    },
    exit: reduce
      ? { opacity: 0 }
      : { opacity: 0, y: 80, transition: { duration: 0.35, ease: easeOut } },
  };

  return (
    <AnimatePresence>
      {hydrated && status === 'pending' && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label={t('cookies.banner.title') as string}
          className={styles.root}
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className={`${styles.inner} gl-gradient-box`}>
            <div className={styles.copy}>
              <p className={styles.title}>{t('cookies.banner.title') as string}</p>
              <p className={styles.description}>{t('cookies.banner.description') as string}</p>
              <CustomLink
                to="/privacy"
                className={styles.learnMore}
                ariaLabel={t('cookies.banner.learnMoreAria') as string}
              >
                {t('cookies.banner.learnMore') as string}
              </CustomLink>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.btnDecline} onClick={decline}>
                {t('cookies.banner.decline') as string}
              </button>
              <button type="button" className={styles.btnAccept} onClick={accept}>
                {t('cookies.banner.accept') as string}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { CookieConsent };
