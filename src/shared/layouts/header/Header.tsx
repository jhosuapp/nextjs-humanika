import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import { DURATION, EASE } from '@/src/shared/helpers/motion-variants';
import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { SCHEDULER_URL } from '@/src/config/site';
import { Button } from '@/src/shared/components/button/Button';

import { headerStaticData } from './header-content';
import { HeaderBrand } from './header-brand/HeaderBrand';
import { HeaderNavList } from './header-nav-list/HeaderNavList';
import { MobileMenu } from './mobile-menu/MobileMenu';

import styles from './header.module.css';

type HeaderProps = { t: ITranslations };

const Header = ({ t }: HeaderProps) => {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  const translatedNav = headerStaticData.nav.map((item) => ({
    label: t(`nav.${item.key}`) as string,
    href: item.href,
    external: item.external,
    children: item.children?.map((child) => ({
      label: t(`nav.${child.key}`) as string,
      href: child.href,
      external: child.external,
    })),
  }));

  return (
    <motion.header
      className={styles.header}
      data-scrolled={scrolled}
      data-menu-open={menuOpen}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.base, ease: EASE }}
    >
      <a href="#main-content" className={styles.skipLink}>
        {t('header.skipLink')}
      </a>

      <div className={styles.inner}>
        <HeaderBrand brand={headerStaticData.brand} />

        <nav className={styles.navDesktop} aria-label="Primary">
          <HeaderNavList items={translatedNav} variant="desktop" />
        </nav>

        <div className={styles.actions}>
          <div className={styles.ctas}>
            <Button
              text={t('header.scheduleConsulting') as string}
              style="fit"
              type="button"
              redirectTo={SCHEDULER_URL}
            />
          </div>
          <MobileMenu
            open={menuOpen}
            onClose={closeMenu}
            onToggle={toggleMenu}
            t={t}
            translatedNav={translatedNav}
          />
        </div>
      </div>
    </motion.header>
  );
};

export { Header };
