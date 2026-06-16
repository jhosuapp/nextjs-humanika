import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { footerStaticData } from '@/src/shared/layouts/footer/footer-content';
import { useLenisStore } from '@/src/shared/stores/lenis.store';
import { Container } from '@/src/features/home/components/container/Container';
import { Logo } from '@/src/shared/components/logo/Logo';

import styles from './footer-nav.module.css';

type FooterNavProps = { t: ITranslations };

const FooterNav = ({ t }: FooterNavProps) => {
  const { brand, nav } = footerStaticData;
  const lenis = useLenisStore(state => state.lenis);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href') || '/';
    const hashMatch = href.match(/^(?:\/)?#(.+)$/);

    if (hashMatch) {
      const isHome = router.pathname === '/';
      if (isHome) {
        lenis?.scrollTo(`#${hashMatch[1]}`, { duration: 0.9, offset: -80 });
      } else {
        router.push(href);
      }
      return;
    }

    lenis?.scrollTo(0, { duration: 0.7 });
    setTimeout(() => router.push(href), 700);
  };

  return (
    <Container className={styles.root} padding='md'>
      <div className={styles.brandBlock}>
        <Link
          href="/"
          className={styles.brandMark}
          aria-label={t('footer.brand.homeAria', { name: brand.name }) as string}
        >
          <Logo alt={brand.name} width={240} height={28} mobileHeight={26} />
        </Link>
      </div>

      <nav
        className={styles.columns}
        aria-label={t('footer.nav.ariaLabel') as string}
      >
        {nav.columns.map((column) => (
          <div key={column.key} className={styles.column}>
            <h3 className={styles.columnTitle}>
              {t(`footer.nav.${column.key}.title`)}
            </h3>
            <ul className={styles.list}>
              {column.links.map((link) => (
                <li key={link.key} className={styles.listItem}>
                  <a
                    href={link.href}
                    className={styles.link}
                    {...(link.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : { onClick: handleClick })}
                  >
                    <span>{t(`footer.nav.${column.key}.${link.key}`)}</span>
                    {link.external ? (
                      <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        className={styles.linkIcon}
                        aria-hidden="true"
                      />
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </Container>
  );
};

export { FooterNav };
