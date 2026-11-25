import { useEffect, useRef, useState, type JSX } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import type { ProductDemoConfig } from '@/src/features/products/types/product.types';
import { Container } from '@/src/features/home/components/container/Container';
import { SectionHeader } from '@/src/shared/components/section-header/SectionHeader';

import { DemoScene, type DemoSceneLabels } from './DemoScene';
import { DemoPanel, type ChatLine } from './DemoPanel';
import styles from './product-demo.module.css';

type ProductDemoProps = {
  t: ITranslations;
  slug: string;
  config: ProductDemoConfig;
};

/** Duration of each step while autoplaying. */
const STEP_MS = 4200;

/**
 * Interactive "how it works" section: a layered 3D scene (channels → agent →
 * sources / operator) with a light packet following each step, synced with a
 * simulated conversation. Autoplays while in view; steps are also clickable.
 */
const ProductDemo = ({ t, slug, config }: ProductDemoProps): JSX.Element | null => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const entered = useInView(ref, { amount: 0.35, once: true });
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const base = `items.${slug}.demo`;
  const steps = t(`${base}.steps`, { returnObjects: true }) as {
    title: string;
    text: string;
  }[];
  const chat = t(`${base}.chat`, { returnObjects: true }) as ChatLine[];
  const sceneLabels: DemoSceneLabels = {
    layers: t(`${base}.layers`, { returnObjects: true }) as DemoSceneLabels['layers'],
    channels: t(`${base}.channels`, { returnObjects: true }) as string[],
    sources: t(`${base}.sources`, { returnObjects: true }) as string[],
  };

  const isAutoplaying = playing && inView && !reduce;

  useEffect(() => {
    if (!isAutoplaying) return;
    const timer = window.setTimeout(
      () => setStepIndex((index) => (index + 1) % config.steps.length),
      STEP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [isAutoplaying, stepIndex, config.steps.length]);

  const step = config.steps[stepIndex];

  // If the copy is missing (stale i18n cache or a product without
  // `items.<slug>.demo`), `t(..., { returnObjects })` returns the key as a
  // string. Skip the section instead of crashing the whole page.
  const hasCopy =
    Array.isArray(steps) &&
    Array.isArray(chat) &&
    Array.isArray(sceneLabels.channels) &&
    Array.isArray(sceneLabels.sources) &&
    typeof sceneLabels.layers === 'object' &&
    steps.length === config.steps.length;
  if (!hasCopy) return null;

  return (
    <div className={styles.section}>
      <span className={styles.glow} aria-hidden="true" />
      <Container padding="xl">
        <SectionHeader
          className={styles.header}
          eyebrow={t(`${base}.eyebrow`) as string}
          title={t(`${base}.title`) as string}
          description={t(`${base}.description`) as string}
        />

        <div ref={ref} className={styles.layout}>
          <DemoScene
            config={config}
            step={step}
            stepIndex={stepIndex}
            labels={sceneLabels}
            entered={entered}
            inView={inView}
          />
          <DemoPanel
            steps={steps}
            chat={chat}
            stepIndex={stepIndex}
            visibleMessages={step.messages}
            playing={isAutoplaying}
            stepMs={STEP_MS}
            labels={{
              // Analysis products show an activity log instead of a chat.
              agent: t(`${base}.panel.title`, {
                defaultValue: sceneLabels.layers.agent,
              }) as string,
              online: t(`${base}.panel.status`, {
                defaultValue: t('ui.demoOnline'),
              }) as string,
              simulation: t('ui.demoSimulation') as string,
              play: t('ui.demoPlay') as string,
              pause: t('ui.demoPause') as string,
              step: t('ui.demoStep') as string,
            }}
            onSelect={(index) => setStepIndex(index)}
            onTogglePlay={() => setPlaying((value) => !value)}
          />
        </div>
      </Container>
    </div>
  );
};

export { ProductDemo };
