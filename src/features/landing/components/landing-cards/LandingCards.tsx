import type { JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import type { LandingCardsSection } from '@/src/features/landing/types/landing.types';
import { Container } from '@/src/features/home/components/container/Container';
import { CustomLink } from '@/src/shared/components/custom-link/CustomLink';
import { SectionHeader } from '@/src/shared/components/section-header/SectionHeader';
import { StaggerGroup, StaggerItem } from '@/src/shared/components/motion/StaggerGroup';
import { REVEAL } from '@/src/shared/helpers/motion-variants';

import styles from './landing-cards.module.css';

type LandingCardsProps = {
  t: ITranslations;
  section: LandingCardsSection;
  /** Alternates the background so consecutive sections read as separate. */
  tone: 'base' | 'alt';
  moreLabel: string;
};

type CardCopy = { title: string; text: string };

const LandingCards = ({ t, section, tone, moreLabel }: LandingCardsProps): JSX.Element => {
  const base = `sections.${section.id}`;
  const items = t(`${base}.items`, { returnObjects: true }) as CardCopy[];
  const list = Array.isArray(items) ? items : [];

  return (
    <div id={section.id} className={styles.section} data-tone={tone}>
      <Container padding="xl">
        <SectionHeader
          className={styles.header}
          eyebrow={t(`${base}.eyebrow`) as string}
          title={t(`${base}.title`) as string}
          description={t(`${base}.description`) as string}
        />
        {/* 4 cards read better as 2×2 than as 3 + 1 orphan. */}
        <StaggerGroup
          as="ul"
          className={`${styles.grid} ${list.length === 4 ? styles.gridPairs : ''}`}
          stagger={REVEAL.stagger}
          amount={REVEAL.amount}
        >
          {list.map((item, index) => {
            const href = section.links?.[index] ?? null;
            const body = (
              <>
                <span className={styles.icon} aria-hidden="true">
                  <FontAwesomeIcon icon={section.icons[index]} />
                </span>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.text}>{item.text}</p>
                {href && (
                  <span className={styles.more}>
                    {moreLabel}
                    <FontAwesomeIcon icon={faArrowRightLong} aria-hidden="true" />
                  </span>
                )}
              </>
            );

            return (
              <StaggerItem as="li" key={item.title} className={styles.item}>
                {href ? (
                  <CustomLink to={href} className={`${styles.card} ${styles.cardLink} gl-gradient-box gl-card`}>
                    {body}
                  </CustomLink>
                ) : (
                  <article className={`${styles.card} gl-gradient-box gl-card`}>{body}</article>
                )}
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Container>
    </div>
  );
};

export { LandingCards };
