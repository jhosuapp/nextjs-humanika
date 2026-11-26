import type { JSX } from 'react';

import { LegalDocument } from '@/src/features/legal/components/legal-document/LegalDocument';
import type { RichTextBlock } from '@/src/shared/components/rich-text/RichText';
import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';

type PrivacyViewProps = { t: ITranslations };

const PrivacyView = ({ t }: PrivacyViewProps): JSX.Element => {
  const blocks = t('sections', { returnObjects: true }) as RichTextBlock[];

  return (
    // No whole-document reveal: a tall element may never reach the in-view
    // threshold. LegalDocument animates its header and body blocks itself.
    <LegalDocument
      title={t('hero.title') as string}
      lastUpdated={t('hero.lastUpdated') as string}
      blocks={blocks}
    />
  );
};

export { PrivacyView };
