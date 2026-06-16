import Image from 'next/image';

import { FadeIn } from '@/src/shared/components/motion/FadeIn';
import {
  MotionTabs,
  type Tab,
} from '@/src/shared/components/motion/MotionTabs';
import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { homeStaticData } from '@/src/features/home/data/home-content';
import type { AudienceTabStatic } from '@/src/features/home/data/home-content';

import styles from './audience-tabs-section.module.css';
import { Container } from '../container/Container';
import { Text } from '@/src/shared/components/text/Text';
import { WrapperMotion } from '@/src/shared/components/wrapper-motion/WrapperMotion';
import { revealDelay } from '@/src/shared/helpers/motion-variants';

type Props = { t: ITranslations };
type TabKey = AudienceTabStatic['key'];

const AudienceTabsSection = ({ t }: Props) => {
  const { audience } = homeStaticData;

  const tabs: ReadonlyArray<Tab<TabKey>> = audience.tabs.map((tabItem) => {
    const bullets = t(`audience.${tabItem.key}.bullets`, { returnObjects: true }) as string[];

    return {
      key: tabItem.key,
      label: t(`audience.${tabItem.key}.label`) as string,
      content: (
        <article className={styles.panel}>
          <div className={styles.panelText}>
            <Text 
              tag="p" 
              variant="description_xs" 
              color="secondary"
              delay={{ enter: 0.1, exit: 0.4 }}
              fadeUpTertiary
              immediate
            >
              <strong className='gl-degradete-text font-semibold'>{t(`audience.${tabItem.key}.label`)}</strong>
            </Text>
            <Text 
              tag="h3" 
              variant="subtitle_small" 
              color="secondary"
              delay={{ enter: 0.2, exit: 0.3 }}
              fadeUpTertiary
              immediate
            >
              {t(`audience.${tabItem.key}.title`)}
            </Text>
            <Text 
              tag="p" 
              variant="description" 
              color="muted"
              delay={{ enter: 0.3, exit: 0.2 }}
              fadeUpTertiary
              immediate
            >
              {t(`audience.${tabItem.key}.description`)}
            </Text>
            <ul className={styles.bullets}>
              {bullets.map((bullet, index) => (
                <WrapperMotion
                  key={bullet}
                  delay={{ enter: 0.4 + index * 0.1, exit: 0.1 }}
                  fadeUpTertiary
                  immediate
                >
                  <li className={styles.bullet}>
                    {bullet}
                  </li>
                </WrapperMotion>
              ))}
            </ul>
            <WrapperMotion delay={{ enter: 0.5, exit: 0.1 }} fadeUpTertiary immediate>
              <p className={styles.availability}>
                <span className={styles.availabilityLabel}>
                  {t('audience.availableOn')}
                </span>{' '}
                {t(`audience.${tabItem.key}.channels`)}
              </p>
            </WrapperMotion>
          </div>
          <div className={styles.panelMedia}>
            <Image
              src={tabItem.image}
              alt={t(`audience.${tabItem.key}.label`) as string}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={styles.panelMediaImage}
            />
            <span className={styles.panelMediaOverlay} aria-hidden="true" />
          </div>
        </article>
      ),
    };
  });

  return (
    <Container id="solutions" className={styles.section} aria-labelledby="audience-title" padding='xl'>
      <FadeIn className={styles.header} y={16}>
        <Text 
          tag="h2" 
          variant="title_small" 
          color="secondary"
          weight="bold"
          delay={{ enter: revealDelay(0), exit: 0 }}
          fadeUpTertiary
        >
          <strong className='gl-degradete-text font-bold'>{t('audience.title_strong')}</strong> {t('audience.title')}
        </Text>
        <Text 
          tag="p" 
          variant="description" 
          color="muted"
          delay={{ enter: revealDelay(1), exit: 0 }}
          fadeUpTertiary
        >
          {t('audience.description')}
        </Text>
      </FadeIn>

      <MotionTabs<TabKey>
        tabs={tabs}
        layoutId="audience-tab-indicator"
        className={styles.tabsHost}
      />
    </Container>
  );
};

export { AudienceTabsSection };
