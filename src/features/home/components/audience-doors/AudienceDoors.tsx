import type { JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong, faBuilding, faLandmark } from '@fortawesome/free-solid-svg-icons';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { CustomLink } from '@/src/shared/components/custom-link/CustomLink';
import { SectionHeader } from '@/src/shared/components/section-header/SectionHeader';
import { StaggerGroup, StaggerItem } from '@/src/shared/components/motion/StaggerGroup';
import { Spotlight } from '@/src/shared/components/spotlight/Spotlight';
import { REVEAL } from '@/src/shared/helpers/motion-variants';
import { Container } from '../container/Container';

import styles from './audience-doors.module.css';

type AudienceDoorsProps = { t: ITranslations };

/** The two audiences Humanika serves, each leading to its own hub page. */
const DOORS = [
  { key: 'business', href: '/empresas', icon: faBuilding },
  { key: 'public', href: '/entidades-publicas', icon: faLandmark },
] as const;

const AudienceDoors = ({ t }: AudienceDoorsProps): JSX.Element => (
  <div className={styles.section}>
    <Container padding="xl">
      <SectionHeader
        className={styles.header}
        titleClassName={styles.headerTitle}
        title={t('doors.title')}
        description={t('doors.description')}
      />
      <StaggerGroup as="ul" className={styles.grid} stagger={REVEAL.stagger} amount={REVEAL.amount}>
        {DOORS.map((door) => (
          <StaggerItem as="li" key={door.key} className={styles.item}>
            <CustomLink to={door.href} className={`${styles.card} gl-gradient-box gl-card`}>
              <Spotlight size={360} />
              <span className={styles.icon} aria-hidden="true">
                <FontAwesomeIcon icon={door.icon} />
              </span>
              <h3 className={styles.title}>{t(`doors.items.${door.key}.title`) as string}</h3>
              <p className={styles.text}>{t(`doors.items.${door.key}.text`) as string}</p>
              <span className={styles.cta}>
                {t(`doors.items.${door.key}.cta`) as string}
                <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" />
              </span>
            </CustomLink>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Container>
  </div>
);

export { AudienceDoors };
