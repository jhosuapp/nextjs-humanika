import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

import { DURATION, EASE } from '@/src/shared/helpers/motion-variants';

import styles from './header-nav-list.module.css';

type NavLink = {
  label: string;
  href: string;
  external?: boolean;
  children?: ReadonlyArray<NavLink>;
};

type NavDropdownProps = {
  item: NavLink;
  variant: 'desktop' | 'mobile';
  onNavigate: (href: string) => void;
};

const NavDropdown = ({ item, variant, onNavigate }: NavDropdownProps) => {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const children = item.children ?? [];
  const isMobile = variant === 'mobile';

  const currentPath = router.asPath.split(/[?#]/)[0];
  // Active when on the section landing page (e.g. "/blog"), any nested route
  // ("/blog/<article>"), or one of the explicitly listed children.
  const isChildActive =
    currentPath === item.href ||
    currentPath.startsWith(`${item.href}/`) ||
    children.some((child) => currentPath === child.href);

  // Desktop opens on hover; mobile is a click-driven accordion.
  const hoverHandlers = isMobile
    ? {}
    : {
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
      };

  const handleChildClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    event.preventDefault();
    setOpen(false);
    onNavigate(href);
  };

  return (
    <div
      className={`${styles.dropdown} ${isMobile ? styles.dropdownMobile : ''}`}
      {...hoverHandlers}
    >
      <button
        type="button"
        className={`${styles.link} ${styles.trigger} ${isChildActive ? styles.linkActive : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        {item.label}
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.ul
            className={`${styles.panel} ${isMobile ? styles.panelMobile : ''}`}
            initial={isMobile ? { height: 0, opacity: 0 } : { opacity: 0, y: -8 }}
            animate={isMobile ? { height: 'auto', opacity: 1 } : { opacity: 1, y: 0 }}
            exit={isMobile ? { height: 0, opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduce ? 0.12 : DURATION.fast, ease: EASE }}
          >
            {children.map((child) => {
              const active = currentPath === child.href;
              return (
                <li key={child.label} className={styles.panelItem}>
                  <a
                    href={child.href}
                    className={`${styles.panelLink} ${active ? styles.linkActive : ''}`}
                    aria-current={active ? 'true' : undefined}
                    onClick={(event) => handleChildClick(event, child.href)}
                  >
                    {child.label}
                  </a>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export { NavDropdown };
export type { NavLink };
