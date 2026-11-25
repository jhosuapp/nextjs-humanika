import type { JSX } from 'react';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import type { ProductEntry } from '@/src/features/products/types/product.types';
import { getProductBySlug } from '@/src/features/products/data/products.registry';
import { Container } from '@/src/features/home/components/container/Container';
import { SectionHeader } from '@/src/shared/components/section-header/SectionHeader';
import { StaggerGroup, StaggerItem } from '@/src/shared/components/motion/StaggerGroup';

import { ProductCard } from '../product-card/ProductCard';
import styles from './product-related.module.css';

type ProductRelatedProps = {
  t: ITranslations;
  entry: ProductEntry;
};

const ProductRelated = ({ t, entry }: ProductRelatedProps): JSX.Element => {
  const related = entry.related
    .map((slug) => getProductBySlug(slug))
    .filter((item): item is ProductEntry => Boolean(item));

  return (
    <div className={styles.section}>
      <Container padding="xl">
        <SectionHeader
          className={styles.header}
          eyebrow={t('ui.relatedEyebrow') as string}
          title={t('ui.relatedTitle') as string}
          description={t('ui.relatedDescription') as string}
        />

        <StaggerGroup as="ul" className={styles.grid} stagger={0.1}>
          {related.map((item) => (
            <StaggerItem as="li" key={item.slug} className={styles.item}>
              <ProductCard
                href={`/productos/${item.slug}`}
                image={item.image}
                imageAlt={t(`items.${item.slug}.imageAlt`) as string}
                category={t(`categories.${item.category}`) as string}
                title={t(`items.${item.slug}.shortTitle`) as string}
                line={t(`items.${item.slug}.cardLine`) as string}
                cta={t('ui.viewProduct') as string}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </div>
  );
};

export { ProductRelated };
