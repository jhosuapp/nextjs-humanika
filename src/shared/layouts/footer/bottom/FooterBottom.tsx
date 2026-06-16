import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { footerStaticData } from '@/src/shared/layouts/footer/footer-content';
import { Container } from '@/src/features/home/components/container/Container';
import { CustomLink } from '@/src/shared/components/custom-link/CustomLink';

import styles from './footer-bottom.module.css';

type FooterBottomProps = { t: ITranslations };

const FooterBottom = ({ t }: FooterBottomProps) => {
  const { bottom } = footerStaticData;
  const year = new Date().getFullYear();

  return (
    <div className={styles.root}>
      <Container className={styles.inner}>
        <p className={styles.copyright}>
          {t('footer.bottom.copyright', { year })}
        </p>

        <div className={styles.block}>
          <ul className={styles.legal} aria-label={t('footer.bottom.legalsAria') as string}>
            {bottom.legalLinks.map((link) => (
              <li key={link.key}>
                <CustomLink to={link.href} className={styles.legalLink}>
                  {t(`footer.bottom.legal.${link.key}`)}
                </CustomLink>
              </li>
            ))}
          </ul>

          <ul className={styles.socials} aria-label={t('footer.bottom.socialsAria') as string}>
            {bottom.socials.map((social) => (
              <li key={social.key}>
                <a
                  href={social.href}
                  className={styles.socialLink}
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    icon={social.icon}
                    className={styles.socialIcon}
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
};

export { FooterBottom };
