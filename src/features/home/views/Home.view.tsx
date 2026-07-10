import type { JSX } from 'react';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { AudienceTabsSection } from '@/src/features/home/components/audience-tabs-section/AudienceTabsSection';
import { FaqSection } from '@/src/features/home/components/faq-section/FaqSection';
import { ProcessStepsSection } from '@/src/features/home/components/process-steps-section/ProcessStepsSection';
import { TrustedByStrip } from '@/src/features/home/components/trusted-by-strip/TrustedByStrip';
import { MainContent } from '@/src/shared/components/main-content/MainContent';
import { HeroSection } from '../components/hero-section/HeroSection';
import { ContactForm } from '../components/contact-form/ContactForm';
import { IntegrationsGrid } from '../components/integrations-grid/IntegrationsGrid';
import { CaseStudiesSection } from '../components/case-studies-section/CaseStudiesSection';

import styles from './home.module.css';
import { MetaPartner } from '@/src/shared/components/meta-partner/MetaPartner';

type HomeViewProps = { t: ITranslations; tBot: ITranslations };

const HomeView = ({ t, tBot }: HomeViewProps): JSX.Element => {
  return (
    <MainContent className={styles.home}>
      <HeroSection t={t} tbot={tBot} />
      <ContactForm t={t} />
      <TrustedByStrip t={t} />
      <AudienceTabsSection t={t} />
      <MetaPartner />
      <ProcessStepsSection t={t} />
      <IntegrationsGrid t={t} />
      {/* <CaseStudiesSection t={t} /> */}
      <FaqSection t={t} />
    </MainContent>
  );
};

export { HomeView };
