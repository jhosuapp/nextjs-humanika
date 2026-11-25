import type { JSX } from 'react';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { Container } from '@/src/features/home/components/container/Container';
import { CustomLink } from '@/src/shared/components/custom-link/CustomLink';
import { MainContent } from '@/src/shared/components/main-content/MainContent';
import { Text } from '@/src/shared/components/text/Text';

import styles from './not-found.module.css';

type NotFoundViewProps = { t: ITranslations };

const LINKS = [
  { key: 'home', href: '/' },
  { key: 'products', href: '/productos' },
  { key: 'blog', href: '/blog' },
] as const;

const NotFoundView = ({ t }: NotFoundViewProps): JSX.Element => (
  <MainContent className={styles.page}>
    <Container padding="xl">
      <div className={styles.content}>
        <Text tag="p" variant="description_xs" color="primary" weight="semibold" delay={{ enter: 0.53, exit: 0.14 }} immediate>
          {t('notFound.eyebrow') as string}
        </Text>
        <Text tag="h1" variant="title" color="secondary" weight="bold" delay={{ enter: 0.54, exit: 0.13 }} immediate>
          {t('notFound.title') as string}
        </Text>
        <Text tag="p" variant="subtitle_small" color="muted" weight="normal" delay={{ enter: 0.56, exit: 0.12 }} immediate>
          {t('notFound.description') as string}
        </Text>
        <nav className={styles.links} aria-label={t('notFound.title') as string}>
          {LINKS.map((link) => (
            <CustomLink key={link.key} to={link.href} className={styles.link}>
              {t(`notFound.links.${link.key}`) as string}
            </CustomLink>
          ))}
        </nav>
      </div>
    </Container>
  </MainContent>
);

export { NotFoundView };
