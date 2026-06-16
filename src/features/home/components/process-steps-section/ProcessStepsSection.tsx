import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { Text } from '@/src/shared/components/text/Text';
import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { homeStaticData } from '@/src/features/home/data/home-content';
import { revealDelay } from '@/src/shared/helpers/motion-variants';

import { FloatIcon } from './FloatIcon';
import { ProcessStep } from './ProcessStep';
import styles from './process-steps-section.module.css';
import { WrapperMotion } from '@/src/shared/components/wrapper-motion/WrapperMotion';
import Image from 'next/image';

type Props = { t: ITranslations };

const STEP_COUNT = homeStaticData.process.steps.length;

const ProcessStepsSection = ({ t }: Props) => {
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  // Fire the whole timeline once, when the section scrolls into view —
  // no longer tied to scroll progress.
  const inView = useInView(wrapperRef, { once: true, amount: 0.4 });

  // -1 = nothing revealed yet. Once in view, the steps light up one after
  // another via staggered timers (reduced motion shows them all at once).
  const [activeStep, setActiveStep] = useState(reduce ? STEP_COUNT - 1 : -1);

  useEffect(() => {
    if (!inView || reduce) return;
    const timers = homeStaticData.process.steps.map((_, i) =>
      window.setTimeout(() => setActiveStep(i), 250 + i * 450),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [inView, reduce]);

  const activeIcon = homeStaticData.process.steps[Math.max(activeStep, 0)].icon;

  return (
    <section
      id="process"
      ref={wrapperRef}
      className={styles.wrapper}
      aria-label={`${t('process.titleLead')}${t('process.titleAccent')}`}
    >
      <div className={styles.sticky}>
        <Image className={ styles.image } src={'/images/bg-update.jpg'} alt='test' width={1920} height={1220}/>
        {!reduce &&
          homeStaticData.process.floatIcons.map((item) => (
            <FloatIcon
              key={item.id}
              icon={activeIcon}
              side={item.side}
              topPercent={item.topPercent}
              offset={item.offset}
              size={item.size}
              rotate={item.rotate}
              accent={item.accent}
            />
          ))}
        <div className={`${styles.card} gl-gradient-box`}>
          <Text
            tag="h2"
            variant="title_small"
            color="secondary"
            weight="semibold"
            delay={{ enter: revealDelay(0), exit: 0 }}
            className="text-center"
            fadeUpTertiary
          >
            {t('process.titleLead') as string}
            {/* <strong className="gl-degradete-text font-semibold"> */}
              {t('process.titleAccent') as string}
            {/* </strong> */}
          </Text>
          <WrapperMotion delay={{ enter:0, exit: 0 }} fadeUpTertiary>
            <div className={styles.track}>
              <div className={styles.lineRail} aria-hidden="true" />
              <motion.div
                className={styles.lineFill}
                aria-hidden="true"
                initial={{ '--p': reduce ? 1 : 0 }}
                animate={inView || reduce ? { '--p': 1 } : undefined}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
              />
              {!reduce && (
                <motion.span
                  className={styles.comet}
                  aria-hidden="true"
                  initial={{ left: '12.5%', opacity: 0 }}
                  animate={inView ? { left: '87.5%', opacity: [0, 1, 1, 0] } : undefined}
                  transition={{
                    left: { duration: 1.8, ease: 'easeInOut' },
                    opacity: { duration: 1.8, ease: 'easeInOut', times: [0, 0.08, 0.85, 1] },
                  }}
                />
              )}
              {homeStaticData.process.steps.map((step, i) => (
                <ProcessStep
                  key={step.id}
                  index={i}
                  active={i <= activeStep}
                  icon={step.icon}
                  label={t(`process.steps.${step.id}.label`) as string}
                />
              ))}
            </div>
          </WrapperMotion>
        </div>
        <div className={ `${styles.card} ${styles.cardSecondary} gl-gradient-box` }>
          <Text
            tag="p"
            variant="description_small"
            color="muted"
            weight="semibold"
            delay={{ enter: revealDelay(0), exit: 0 }}
            className="text-center"
            fadeUpTertiary
          >
            {t('process.description')}
          </Text>
        </div>
      </div>
    </section>
  );
};

export { ProcessStepsSection };
