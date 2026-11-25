import type { JSX } from 'react';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import type { LandingGroupsSection } from '@/src/features/landing/types/landing.types';
import { Container } from '@/src/features/home/components/container/Container';
import { SectionHeader } from '@/src/shared/components/section-header/SectionHeader';
import { StaggerGroup, StaggerItem } from '@/src/shared/components/motion/StaggerGroup';
import { REVEAL } from '@/src/shared/helpers/motion-variants';

import styles from './landing-groups.module.css';

type LandingGroupsProps = {
  t: ITranslations;
  section: LandingGroupsSection;
  tone: 'base' | 'alt';
};

type GroupCopy = { title: string; items: string[] };

/** Titled groups of chips (channels, integrations, languages…). Plain text
 *  on purpose: names are entities search engines and AI answers can read. */
const LandingGroups = ({ t, section, tone }: LandingGroupsProps): JSX.Element => {
  const base = `sections.${section.id}`;
  const groups = t(`${base}.groups`, { returnObjects: true }) as GroupCopy[];
  const list = Array.isArray(groups) ? groups : [];

  return (
    <div id={section.id} className={styles.section} data-tone={tone}>
      <Container padding="xl">
        <SectionHeader
          className={styles.header}
          eyebrow={t(`${base}.eyebrow`) as string}
          title={t(`${base}.title`) as string}
          description={t(`${base}.description`) as string}
        />
        <StaggerGroup className={styles.groups} stagger={REVEAL.stagger} amount={REVEAL.amount}>
          {list.map((group) => (
            <StaggerItem key={group.title} className={`${styles.group} gl-gradient-box`}>
              <h3 className={styles.groupTitle}>{group.title}</h3>
              <ul className={styles.chips}>
                {group.items.map((item) => (
                  <li key={item} className={styles.chip}>
                    {item}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </div>
  );
};

export { LandingGroups };
