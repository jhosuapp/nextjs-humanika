import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { footerStaticData } from '@/src/shared/layouts/footer/footer-content';
import { Container } from '@/src/features/home/components/container/Container';
import { Logo } from '@/src/shared/components/logo/Logo';
import { CustomLink } from '@/src/shared/components/custom-link/CustomLink';

import styles from './footer-nav.module.css';

type FooterNavProps = { t: ITranslations };

const FooterNav = ({ t }: FooterNavProps) => {
  const { brand, nav } = footerStaticData;

  return (
    <Container className={styles.root} padding='md'>
      <div className={styles.brandBlock}>
        <CustomLink
          to="/"
          className={styles.brandMark}
          ariaLabel={t('footer.brand.homeAria', { name: brand.name }) as string}
        >
          <Logo alt={brand.name} width={240} height={28} mobileHeight={26} />
        </CustomLink>
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
                  <CustomLink
                    to={link.href}
                    className={styles.link}
                    external={link.external}
                  >
                    <span>{t(`footer.nav.${column.key}.${link.key}`)}</span>
                    {link.external ? (
                      <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        className={styles.linkIcon}
                        aria-hidden="true"
                      />
                    ) : null}
                  </CustomLink>
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
