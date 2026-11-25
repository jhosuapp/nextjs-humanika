import type { JSX } from 'react';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import type { ProductEntry } from '@/src/features/products/types/product.types';
import { MainContent } from '@/src/shared/components/main-content/MainContent';
import { buildDemoWhatsappUrl } from '@/src/features/products/helpers/build-demo-whatsapp-url';

import { ProductHero } from '../components/product-hero/ProductHero';
import { ProductFeatures } from '../components/product-features/ProductFeatures';
import { ProductDemo } from '../components/product-demo/ProductDemo';
import { ProductUseCase } from '../components/product-use-case/ProductUseCase';
import { ProductCta } from '../components/product-cta/ProductCta';
import { ProductRelated } from '../components/product-related/ProductRelated';
import styles from './product-detail.module.css';

type ProductDetailViewProps = {
  t: ITranslations;
  entry: ProductEntry;
};

const USE_CASE_ID = 'caso-de-uso';
const BRAND_PREFIX = /^Humanika\s*[–-]\s*/;

const ProductDetailView = ({
  t,
  entry,
}: ProductDetailViewProps): JSX.Element => {
  const title = t(`items.${entry.slug}.title`) as string;
  const shortTitle = t(`items.${entry.slug}.shortTitle`) as string;
  const demoUrl = buildDemoWhatsappUrl(
    t('ui.whatsappMessage', { product: title }) as string,
  );

  return (
    <MainContent className={styles.page}>
      <ProductHero
        t={t}
        entry={entry}
        name={title.replace(BRAND_PREFIX, '')}
        demoUrl={demoUrl}
        useCaseId={USE_CASE_ID}
      />
      <ProductFeatures t={t} entry={entry} shortTitle={shortTitle} />
      {entry.demo && (
        <ProductDemo t={t} slug={entry.slug} config={entry.demo} />
      )}
      <ProductUseCase t={t} entry={entry} id={USE_CASE_ID} />
      <ProductCta
        t={t}
        slug={entry.slug}
        shortTitle={shortTitle}
        demoUrl={demoUrl}
      />
      <ProductRelated t={t} entry={entry} />
    </MainContent>
  );
};

export { ProductDetailView };
