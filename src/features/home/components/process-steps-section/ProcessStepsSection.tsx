import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useRef, useState } from 'react';

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

const STEP_THRESHOLDS = [0, 0.38, 0.58, 0.78] as const;

const resolveActiveStep = (latest: number): number => {
  let active = 0;
  for (let i = 0; i < STEP_THRESHOLDS.length; i++) {
    if (latest >= STEP_THRESHOLDS[i]) active = i;
  }
  return active;
};

const ProcessStepsSection = ({ t }: Props) => {
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });
  const { scrollYProgress: parallaxProgress } = useScroll({
    target: wrapperRef,
    offset: ['start end', 'end start'],
  });

  const lineProgressRaw = useTransform(scrollYProgress, [0.12, 0.85], [0, 1]);
  const lineProgress = useSpring(lineProgressRaw, {
    stiffness: 90,
    damping: 22,
    mass: 0.5,
  });

  const cometRaw = useTransform(scrollYProgress, [0.08, 0.9], [12.5, 87.5]);
  const cometX = useSpring(cometRaw, {
    stiffness: 110,
    damping: 20,
    mass: 0.5,
  });
  const cometLeft = useMotionTemplate`${cometX}%`;
  const cometOpacity = useTransform(
    scrollYProgress,
    [0.06, 0.12, 0.88, 0.94],
    [0, 1, 1, 0],
  );

  const [activeStep, setActiveStep] = useState(() =>
    resolveActiveStep(scrollYProgress.get()),
  );

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const next = resolveActiveStep(latest);
    setActiveStep((prev) => (prev === next ? prev : next));
  });

  const activeIcon = homeStaticData.process.steps[activeStep].icon;

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
              progress={parallaxProgress}
            />
          ))}
        <div className={styles.card}>
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
                style={{ '--p': reduce ? 1 : lineProgress } as React.CSSProperties}
              />
              {!reduce && (
                <motion.span
                  className={styles.comet}
                  aria-hidden="true"
                  style={{ left: cometLeft, opacity: cometOpacity }}
                />
              )}
              {homeStaticData.process.steps.map((step, i) => (
                <ProcessStep
                  key={step.id}
                  index={i}
                  progress={scrollYProgress}
                  threshold={STEP_THRESHOLDS[i]}
                  icon={step.icon}
                  label={t(`process.steps.${step.id}.label`) as string}
                />
              ))}
            </div>
          </WrapperMotion>
        </div>
        <div className={ `${styles.card} ${styles.cardSecondary} gl-dropshadow` }>
          <Text
            tag="p"
            variant="description_small"
            color="secondary"
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
