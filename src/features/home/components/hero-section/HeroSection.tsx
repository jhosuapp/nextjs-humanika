import type { JSX } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BotEmbed } from '../bot-embed/BotEmbed';
import { Text } from '@/src/shared/components/text/Text';
import { Container } from '../container/Container';
import { Button } from '@/src/shared/components/button/Button';
import { WrapperMotion } from '@/src/shared/components/wrapper-motion/WrapperMotion';
import { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import styles from './hero-section.module.css';
import { WHATSAPP_URL } from '@/src/config/site';

type HeroSectionProps = {
  t: ITranslations;
  tbot: ITranslations;
};

const HeroSection = ({ t, tbot }: HeroSectionProps):JSX.Element => {
  const reduce = useReducedMotion();

  return (
    <section className={ styles.heroSection }>
      <div className={styles.heroSection__orbs} aria-hidden="true">
        <motion.span
          className={`${styles.heroSection__orb} ${styles.heroSection__orbCyan}`}
          animate={reduce ? undefined : { x: [0, 24, 0], y: [0, -16, 0] }}
          transition={{ duration: 14, ease: 'easeInOut', repeat: Infinity }}
        />
        <motion.span
          className={`${styles.heroSection__orb} ${styles.heroSection__orbTeal}`}
          animate={reduce ? undefined : { x: [0, -28, 0], y: [0, 20, 0] }}
          transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity }}
        />
      </div>
      <Container className={ styles.heroSection__wrapper } padding='md'>
        <article className={ styles.heroSection__bot }>
          <WrapperMotion delay={{ enter: 0.52, exit: 0.15 }} immediate>
            <BotEmbed t={tbot} />
          </WrapperMotion>
        </article>
        <article className={ styles.heroSection__content }>
            <Text
              tag='h1'
              variant='title_small'
              color='secondary'
              delay={{ enter: 0.53, exit: 0.14 }}
              weight='semibold'
              immediate
            >
              {t('hero.titleLead') as string}<strong className='gl-degradete-text font-semibold'>{t('hero.titleAccent') as string}</strong>
              {/* {t('hero.titleLead') as string}<strong className='gl-degradete-text font-semibold'>{t('hero.titleAccent') as string}</strong>{t('hero.titleTrail') as string} */}
            </Text>
            <Text
              tag='h2'
              variant='subtitle_small'
              color='muted'
              delay={{ enter: 0.55, exit: 0.13 }}
              weight='medium'
              immediate
            >
              {t('hero.subtitle') as string}
            </Text>
            <Text
              tag='p'
              variant='description'
              color='muted'
              delay={{ enter: 0.57, exit: 0.12 }}
              weight='normal'
              immediate
            >
              {t('hero.subtitle_small') as string}
            </Text>
            <WrapperMotion delay={{ enter: 0.59, exit: 0.11 }} immediate>
              <div className={ styles.heroSection__buttons }>
                <Button
                  text={t('hero.secondaryCta') as string}
                  style="whatsapp"
                  type="button"
                  iconRight={ faWhatsapp }
                  redirectTo={WHATSAPP_URL}
                />
              </div>
            </WrapperMotion>
        </article>
      </Container>
    </section>
  )
}

export { HeroSection }
