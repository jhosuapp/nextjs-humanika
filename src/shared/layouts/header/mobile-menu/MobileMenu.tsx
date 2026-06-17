import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect, useId, useState } from 'react';

import { DURATION, EASE } from '@/src/shared/helpers/motion-variants';
import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { HeaderNavList } from '../header-nav-list/HeaderNavList';

import styles from './mobile-menu.module.css';
import { ThemeToggle } from '../theme-toggle/ThemeToggle';

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  children?: ReadonlyArray<NavItem>;
};

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
  t: ITranslations;
  translatedNav: ReadonlyArray<NavItem>;
};

const panelVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.base,
      ease: EASE,
      when: 'beforeChildren',
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.2, ease: EASE, when: 'afterChildren' },
  },
};

const reducedPanelVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const groupVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
};

const MobileMenu = ({ open, onClose, onToggle, t, translatedNav }: MobileMenuProps) => {
  const reduce = useReducedMotion();
  const panelId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const variants = reduce ? reducedPanelVariants : panelVariants;

  return (
    <>
      <motion.button
        type="button"
        className={styles.trigger}
        aria-label={open
          ? (t('header.mobileMenu.closeAria') as string)
          : (t('header.mobileMenu.openAria') as string)
        }
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        whileTap={reduce ? undefined : { scale: 0.92 }}
        transition={{ duration: 0.15 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'open'}
            className={styles.triggerIconWrap}
            initial={reduce ? { opacity: 0 } : { opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <FontAwesomeIcon
              icon={open ? faXmark : faBars}
              className={styles.triggerIcon}
              aria-hidden="true"
            />
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {mounted && createPortal(
        <AnimatePresence>
          {open ? (
            <>
              <motion.div
                key="backdrop"
                className={styles.backdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                aria-hidden="true"
              />
              <motion.div
                key="panel"
                id={panelId}
                role="dialog"
                aria-modal="true"
                aria-label={t('header.mobileMenu.dialogAria') as string}
                className={styles.panel}
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.nav
                  className={styles.nav}
                  variants={groupVariants}
                  aria-label="Primary"
                >
                  <HeaderNavList
                    items={translatedNav}
                    variant="mobile"
                    onItemClick={onClose}
                    animated
                  />
                </motion.nav>

                <motion.div className={styles.divider} variants={groupVariants} aria-hidden="true" />

                <motion.div className={styles.controlsRow} variants={groupVariants}>
                  <div className={styles.controlsLabel}>{t('header.mobileMenu.preferences')}</div>
                  <div className={styles.controls}>
                    <ThemeToggle t={t} />
                    {/* <LanguageDropdown t={t} /> */}
                  </div>
                </motion.div>

                <motion.div className={styles.ctas} variants={groupVariants}>
                  {/* <Button
                    className='!w-full'
                    text={t('header.signIn') as string}
                    style="secondary"
                    type="button"
                    onClick={onClose}
                  /> */}
                  {/* <Button
                    className='!w-full'
                    text={t('header.startFree') as string}
                    style="primary"
                    type="button"
                    onClick={onClose}
                  /> */}
                </motion.div>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export { MobileMenu };
