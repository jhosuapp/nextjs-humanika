import type { JSX } from 'react';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import type {
  ProductCategoryId,
  ProductEntry,
} from '@/src/features/products/types/product.types';
import { productsStaticData } from '@/src/features/products/data/products.registry';
import { Container } from '@/src/features/home/components/container/Container';
import { MainContent } from '@/src/shared/components/main-content/MainContent';
import { Text } from '@/src/shared/components/text/Text';
import { SectionHeader } from '@/src/shared/components/section-header/SectionHeader';
import { StaggerGroup, StaggerItem } from '@/src/shared/components/motion/StaggerGroup';
import { REVEAL } from '@/src/shared/helpers/motion-variants';

import { ProductCard } from '../components/product-card/ProductCard';
import styles from './products-catalog.module.css';

type ProductsCatalogViewProps = { t: ITranslations };

/** Families in the brief's order; each one renders as an anchored section. */
const groupByCategory = () => {
  const groups = new Map<ProductCategoryId, ProductEntry[]>();
  productsStaticData.forEach((entry) => {
    groups.set(entry.category, [...(groups.get(entry.category) ?? []), entry]);
  });
  return [...groups.entries()];
};

const ProductsCatalogView = ({ t }: ProductsCatalogViewProps): JSX.Element => (
  <MainContent className={styles.page}>
    <div className={styles.hero}>
      <Container padding="xl">
        <header className={styles.heading}>
          <Text
            tag="p"
            variant="description_xs"
            color="primary"
            weight="semibold"
            delay={{ enter: 0.53, exit: 0.14 }}
            immediate
          >
            {t('catalog.hero.eyebrow') as string}
          </Text>
          <Text
            tag="h1"
            variant="title"
            color="secondary"
            weight="bold"
            delay={{ enter: 0.54, exit: 0.13 }}
            immediate
          >
            {t('catalog.hero.title') as string}
          </Text>
          <Text
            tag="p"
            variant="subtitle_small"
            color="muted"
            weight="normal"
            delay={{ enter: 0.56, exit: 0.12 }}
            immediate
          >
            {t('catalog.hero.description') as string}
          </Text>
        </header>

        {/* Crawlable jump links to every family. */}
        <nav className={styles.jump} aria-label={t('catalog.hero.eyebrow') as string}>
          {groupByCategory().map(([category]) => (
            <a key={category} href={`#${category}`} className={styles.jumpLink}>
              {t(`categories.${category}`) as string}
            </a>
          ))}
        </nav>
      </Container>
    </div>

    {groupByCategory().map(([category, entries]) => (
      <section key={category} id={category} className={styles.family}>
        <Container padding="lg">
          <SectionHeader
            className={styles.familyHeader}
            eyebrow={t('catalog.familyCount', { count: entries.length }) as string}
            title={t(`categories.${category}`) as string}
            description={t(`catalog.families.${category}`) as string}
          />
          <StaggerGroup as="ul" className={styles.grid} stagger={REVEAL.stagger}>
            {entries.map((item) => (
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
      </section>
    ))}
  </MainContent>
);

export { ProductsCatalogView };
