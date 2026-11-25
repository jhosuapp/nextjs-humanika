import type { JSX } from 'react';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import type { LandingStaticData } from '@/src/features/landing/types/landing.types';
import { MainContent } from '@/src/shared/components/main-content/MainContent';
import { buildDemoWhatsappUrl } from '@/src/features/products/helpers/build-demo-whatsapp-url';

import { LandingHero } from '../components/landing-hero/LandingHero';
import { LandingCards } from '../components/landing-cards/LandingCards';
import { LandingGroups } from '../components/landing-groups/LandingGroups';
import { LandingCta } from '../components/landing-cta/LandingCta';
import styles from './landing.module.css';

type LandingViewProps = {
  t: ITranslations;
  data: LandingStaticData;
};

/** Generic informational page: hero → ordered sections → demo CTA. */
const LandingView = ({ t, data }: LandingViewProps): JSX.Element => {
  const demoUrl = buildDemoWhatsappUrl(t('cta.whatsappMessage') as string);
  const moreLabel = t('moreLabel', { defaultValue: 'Ver más' }) as string;

  return (
    <MainContent className={styles.page}>
      <LandingHero
        t={t}
        namespace={data.namespace}
        demoUrl={demoUrl}
        secondaryHref={data.secondaryHref}
      />
      {data.sections.map((section, index) => {
        // Hero uses the alt surface, so sections start on the base one.
        const tone = index % 2 === 0 ? 'base' : 'alt';
        return section.kind === 'cards' ? (
          <LandingCards key={section.id} t={t} section={section} tone={tone} moreLabel={moreLabel} />
        ) : (
          <LandingGroups key={section.id} t={t} section={section} tone={tone} />
        );
      })}
      <LandingCta t={t} namespace={data.namespace} demoUrl={demoUrl} />
    </MainContent>
  );
};

export { LandingView };
