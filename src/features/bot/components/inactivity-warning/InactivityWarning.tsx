import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, motion } from 'framer-motion';
import type { JSX } from 'react';

import { DURATION, EASE } from '@/src/shared/helpers/motion-variants';
import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';

import styles from './inactivity-warning.module.css';

interface Props {
  t: ITranslations;
  visible: boolean;
  onDismiss: () => void;
}

const InactivityWarning = ({ t, visible, onDismiss }: Props): JSX.Element => (
  <AnimatePresence>
    {visible ? (
      <motion.div
        className={`${styles.toast} gl-dropshadow`}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: DURATION.fast, ease: EASE }}
        role="status"
        aria-live="polite"
      >
        <FontAwesomeIcon icon={faClock} className={styles.icon} aria-hidden="true" />
        <span className={`${styles.text} gl-label`}>{t('inactivity.warning')}</span>
        <button
          type="button"
          className={styles.button}
          onClick={onDismiss}
        >
          {t('inactivity.stay')}
        </button>
      </motion.div>
    ) : null}
  </AnimatePresence>
);

export { InactivityWarning };
