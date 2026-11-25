import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type JSX,
  type PointerEvent,
  type ReactNode,
} from 'react';
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Easing,
  type MotionValue,
} from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import type {
  DemoNodeRef,
  ProductDemoConfig,
  ProductDemoStep,
} from '@/src/features/products/types/product.types';
import { EASE } from '@/src/shared/helpers/motion-variants';

import {
  BACK_ROW,
  CAMERA,
  LAYER_Z,
  NODES,
  OPERATOR,
  PLANE,
  ROW,
  connector,
  type Point3D,
} from './demo-geometry';
import styles from './demo-scene.module.css';

/*
 * NOTE ON 3D + OPACITY: any ancestor with `opacity < 1` forces
 * `transform-style: flat`, which squashes standing billboards onto their
 * plane. So opacity is only ever animated on "leaf" elements (flat content),
 * never on a container that holds 3D children (layers, slots, the packet).
 */

type DemoSceneLabels = {
  layers: Record<'channels' | 'agent' | 'sources' | 'operator', string>;
  channels: string[];
  sources: string[];
};

type DemoSceneProps = {
  config: ProductDemoConfig;
  step: ProductDemoStep;
  stepIndex: number;
  labels: DemoSceneLabels;
  /** True once the scene first scrolled into view (drives the intro). */
  entered: boolean;
  /** True while the scene is on screen (drives the packet). */
  inView: boolean;
};

type Camera = { rotX: MotionValue<number>; rotZ: MotionValue<number> };

/**
 * True on touch-first devices. There the scene drops its endless ambient
 * loops (core rings / orb pulse): on iOS Safari each frame re-composites the
 * whole 3D stack, and with several layers at DPR 3 that can exhaust GPU
 * memory and crash the tab.
 */
const TOUCH_QUERY = '(hover: none)';
const subscribeTouch = (onChange: () => void) => {
  const media = window.matchMedia(TOUCH_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};
const useIsTouch = () =>
  useSyncExternalStore(
    subscribeTouch,
    () => window.matchMedia(TOUCH_QUERY).matches,
    () => false,
  );

// Intro choreography (seconds from the moment the scene enters the viewport).
const INTRO = {
  camera: 1.8,
  layer: 1.2,
  layerDelay: { sources: 0, agent: 0.15, channels: 0.3 },
  nodes: 0.75,
  nodeStagger: 0.09,
  core: 0.85,
  spine: 0.95,
  /** The packet starts once the stack has settled. */
  packetReadyMs: 1700,
} as const;

/** Packet speed in scene px/s; trips are clamped to stay readable. */
const PACKET = { speed: 380, min: 0.9, max: 2.2, delay: 0.2 } as const;

const distance = (a: Point3D, b: Point3D) =>
  Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);

/**
 * Turns a step route into a constant-speed keyframe plan, plus the moment the
 * packet reaches each node (so nodes light up on arrival, not before).
 */
const planRoute = (route: DemoNodeRef[]) => {
  const points = route.map((ref) => NODES[ref]);
  const segments = points.slice(1).map((point, i) => distance(points[i], point));
  const total = segments.reduce((sum, length) => sum + length, 0) || 1;
  const duration = Math.min(
    PACKET.max,
    Math.max(PACKET.min, total / PACKET.speed),
  );

  const times = [0];
  let travelled = 0;
  segments.forEach((length) => {
    travelled += length;
    times.push(travelled / total);
  });

  const arrivals = new Map<DemoNodeRef, number>();
  route.forEach((ref, i) => {
    if (!arrivals.has(ref)) {
      arrivals.set(ref, PACKET.delay + times[i] * duration);
    }
  });

  // Ease in on the first leg, cruise, ease out on the last: one fluid trip
  // instead of stopping at every hub.
  const ease: Easing[] =
    segments.length <= 1
      ? ['easeInOut']
      : segments.map((_, i) =>
          i === 0 ? 'easeIn' : i === segments.length - 1 ? 'easeOut' : 'linear',
        );

  return { points, times, duration, ease, arrivals };
};

type RoutePlan = ReturnType<typeof planRoute>;

/**
 * Counter-rotates its content so it always faces the viewer while standing on
 * a tilted plane (inverse of the scene's `rotateX(a) rotateZ(b)`).
 */
const Billboard = ({
  camera,
  className,
  children,
}: {
  camera: Camera;
  className?: string;
  children: ReactNode;
}) => {
  const invZ = useTransform(camera.rotZ, (v) => -v);
  const invX = useTransform(camera.rotX, (v) => -v);
  const transform = useMotionTemplate`rotateZ(${invZ}deg) rotateX(${invX}deg)`;

  return (
    <motion.div className={className} style={{ transform }}>
      {children}
    </motion.div>
  );
};

/** Places a child at a point of its plane (relative to the plane centre). */
const at = (x: number, y: number): CSSProperties => ({
  left: `calc(50% + ${x}px)`,
  top: `calc(50% + ${y}px)`,
});

type NodeProps = {
  camera: Camera;
  icon: IconDefinition;
  label: string;
  entered: boolean;
  entranceDelay: number;
  /** Seconds after the step starts when the packet reaches this node. */
  arrival: number | undefined;
  rippleKey: number;
};

const Node = ({
  camera,
  icon,
  label,
  entered,
  entranceDelay,
  arrival,
  rippleKey,
}: NodeProps) => {
  const active = arrival !== undefined;
  const onDelay = { delay: arrival ?? 0 };

  return (
    <>
      <motion.span
        className={styles.nodeShadowWrap}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={entered ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.6, ease: EASE, delay: entranceDelay }}
      >
        <motion.span
          className={styles.nodeShadow}
          animate={{ opacity: active ? 1 : 0.5, scale: active ? 1.35 : 1 }}
          transition={{ duration: 0.6, ease: EASE, ...(active ? onDelay : {}) }}
        />
      </motion.span>
      <Billboard camera={camera} className={styles.billboard}>
        {/* Entrance: rises from the plane (leaf, so opacity is safe here). */}
        <motion.div
          className={styles.nodeEnter}
          initial={{ opacity: 0, y: 22, scale: 0.6 }}
          animate={entered ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{
            type: 'spring',
            stiffness: 210,
            damping: 22,
            delay: entranceDelay,
          }}
        >
          {/* Active: lifts and glows when the packet arrives. */}
          <motion.div
            className={styles.node}
            animate={{ y: active ? -8 : 0, scale: active ? 1.05 : 1 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 24,
              ...(active ? onDelay : {}),
            }}
          >
            <motion.span
              className={styles.nodeGlow}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: 0.35, ...(active ? onDelay : {}) }}
            />
            <span className={styles.nodeIcon}>
              <FontAwesomeIcon icon={icon} />
              <motion.span
                className={styles.nodeIconActive}
                animate={{ opacity: active ? 1 : 0 }}
                transition={{ duration: 0.35, ...(active ? onDelay : {}) }}
              >
                <FontAwesomeIcon icon={icon} />
              </motion.span>
            </span>
            <span className={styles.nodeLabel}>{label}</span>
            {active && (
              <motion.span
                key={rippleKey}
                className={styles.ripple}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: [0.65, 0], scale: [1, 1.55] }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: arrival }}
              />
            )}
          </motion.div>
        </motion.div>
      </Billboard>
    </>
  );
};

/** A layer: z-lift only (no opacity, see note above). */
const Layer = ({
  z,
  delay,
  entered,
  children,
}: {
  z: number;
  delay: number;
  entered: boolean;
  children: ReactNode;
}) => (
  <motion.div
    className={styles.layer}
    style={{ width: PLANE, height: PLANE }}
    initial={{ z: 0 }}
    animate={{ z: entered ? z : 0 }}
    transition={{ duration: INTRO.layer, ease: EASE, delay }}
  >
    {children}
  </motion.div>
);

/** The flat surface of a layer: plane, focus glow, label and connectors. */
const Surface = ({
  label,
  focused,
  entered,
  delay,
  connectors,
}: {
  label: string;
  focused: boolean;
  entered: boolean;
  delay: number;
  connectors: ReadonlyArray<{ x: number; y: number }>;
}) => (
  <motion.div
    className={styles.surface}
    initial={{ opacity: 0 }}
    animate={{ opacity: entered ? 1 : 0 }}
    transition={{ duration: 0.7, ease: EASE, delay }}
  >
    <motion.div
      className={styles.plane}
      animate={{ opacity: focused ? 1 : 0.7 }}
      transition={{ duration: 0.6, ease: EASE }}
    />
    <motion.div
      className={styles.planeGlow}
      animate={{ opacity: focused ? 1 : 0 }}
      transition={{ duration: 0.6, ease: EASE }}
    />
    <span className={styles.planeLabel} data-active={focused}>
      {label}
    </span>
    {connectors.map((point, i) => {
      const { width, angle } = connector(point);
      return (
        <span
          key={`${point.x}:${point.y}`}
          className={styles.connector}
          style={{ width, transform: `rotate(${angle}deg)` }}
        >
          {/* Draws outwards from the hub during the intro. */}
          <motion.span
            className={styles.connectorLine}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: entered ? 1 : 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: delay + 0.5 + i * 0.08 }}
          />
        </span>
      );
    })}
  </motion.div>
);

/** Light packet (+ comet trail) that travels the active route. */
const Packet = ({
  camera,
  plan,
  lag,
  size,
  fadeKey,
  teleport,
}: {
  camera: Camera;
  plan: RoutePlan;
  lag: number;
  size: 'head' | 'trail' | 'tail';
  fadeKey: number;
  teleport: boolean;
}) => (
  <motion.div
    className={styles.packet}
    animate={{
      x: plan.points.map((p) => p.x),
      y: plan.points.map((p) => p.y),
      z: plan.points.map((p) => p.z),
    }}
    transition={{
      duration: plan.duration,
      times: plan.times,
      ease: plan.ease,
      delay: PACKET.delay + lag,
    }}
  >
    <Billboard camera={camera} className={styles.billboard}>
      <motion.span
        // Re-keyed only when the route starts somewhere new, so the jump to
        // the new start happens while invisible and then fades in.
        key={teleport ? `t-${fadeKey}` : 'steady'}
        className={styles.packetGlow}
        data-size={size}
        initial={teleport ? { opacity: 0, scale: 0.3 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE, delay: PACKET.delay + lag }}
      />
    </Billboard>
  </motion.div>
);

const DemoScene = ({
  config,
  step,
  stepIndex,
  labels,
  entered,
  inView,
}: DemoSceneProps): JSX.Element => {
  const reduce = useReducedMotion();
  const isTouch = useIsTouch();
  /** Ambient loops only where they're cheap: pointer devices, motion allowed. */
  const ambient = !reduce && !isTouch;

  // Camera: eased intro spin + gentle sprung pointer tilt.
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 70, damping: 20 });
  const springY = useSpring(tiltY, { stiffness: 70, damping: 20 });
  const baseZ = useMotionValue<number>(CAMERA.introRotateZ);
  const rotZ = useTransform([baseZ, springX], ([b, t]: number[]) => b + t * 10);
  const rotX = useTransform(springY, (t) => CAMERA.rotateX - t * 8);
  const camera: Camera = { rotX, rotZ };

  useEffect(() => {
    if (!entered) return;
    const controls = animate(baseZ, CAMERA.rotateZ, {
      duration: reduce ? 0 : INTRO.camera,
      ease: EASE,
    });
    return () => controls.stop();
  }, [entered, baseZ, reduce]);

  // The packet waits for the intro to settle.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!entered || ready) return;
    const timer = window.setTimeout(() => setReady(true), INTRO.packetReadyMs);
    return () => window.clearTimeout(timer);
  }, [entered, ready]);

  const plan = useMemo(() => planRoute(step.route), [step.route]);

  // Fade the packet in when a route doesn't start where the last one ended
  // (derived from the previous step during render, React's recommended way).
  const [trip, setTrip] = useState({ index: stepIndex, route: step.route, teleport: true });
  if (trip.index !== stepIndex) {
    setTrip({
      index: stepIndex,
      route: step.route,
      teleport: trip.route[trip.route.length - 1] !== step.route[0],
    });
  }
  const teleport = trip.teleport;

  const showPacket = ready && inView && !reduce;
  // Nodes light up on arrival; before the packet is running, light the route.
  const arrival = (ref: DemoNodeRef) =>
    showPacket ? plan.arrivals.get(ref) : step.route.includes(ref) ? 0 : undefined;

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    tiltX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    tiltY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  };
  const handlePointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const nodeDelay = (layer: keyof typeof INTRO.layerDelay, i: number) =>
    INTRO.layerDelay[layer] + INTRO.nodes + i * INTRO.nodeStagger;
  const agentFocused = step.focus === 'agent' || step.focus === 'operator';
  const agentArrival = arrival('agent');

  return (
    <div
      className={styles.stage}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-hidden="true"
    >
      <div className={styles.scale}>
        <motion.div className={styles.scene} style={{ rotateX: rotX, rotateZ: rotZ }}>
          {/* Sources (base) */}
          <Layer z={LAYER_Z.sources} delay={INTRO.layerDelay.sources} entered={entered}>
            <Surface
              label={labels.layers.sources}
              focused={step.focus === 'sources'}
              entered={entered}
              delay={INTRO.layerDelay.sources}
              connectors={ROW}
            />
            {ROW.map((point, i) => (
              <div key={i} className={styles.slot} style={at(point.x, point.y)}>
                <Node
                  camera={camera}
                  icon={config.sourceIcons[i]}
                  label={labels.sources[i]}
                  entered={entered}
                  entranceDelay={nodeDelay('sources', i)}
                  arrival={arrival(`source-${i}` as DemoNodeRef)}
                  rippleKey={stepIndex}
                />
              </div>
            ))}
          </Layer>

          {/* Agent (middle) */}
          <Layer z={LAYER_Z.agent} delay={INTRO.layerDelay.agent} entered={entered}>
            <Surface
              label={labels.layers.agent}
              focused={agentFocused}
              entered={entered}
              delay={INTRO.layerDelay.agent}
              connectors={[OPERATOR]}
            />
            <div className={styles.slot} style={at(0, 0)}>
              <motion.span
                className={styles.coreShadow}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={entered ? { opacity: 1, scale: 1 } : undefined}
                transition={{ duration: 0.9, ease: EASE, delay: INTRO.core }}
              />
              <Billboard camera={camera} className={styles.billboard}>
                <motion.div
                  className={styles.core}
                  initial={{ opacity: 0, scale: 0.4, y: 24 }}
                  animate={entered ? { opacity: 1, scale: 1, y: 0 } : undefined}
                  transition={{ type: 'spring', stiffness: 160, damping: 20, delay: INTRO.core }}
                >
                  <motion.span
                    className={styles.coreRing}
                    animate={ambient ? { rotate: 360 } : undefined}
                    transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
                  />
                  <motion.span
                    className={`${styles.coreRing} ${styles.coreRingInner}`}
                    animate={ambient ? { rotate: -360 } : undefined}
                    transition={{ duration: 9, ease: 'linear', repeat: Infinity }}
                  />
                  <motion.span
                    className={styles.coreOrb}
                    animate={ambient ? { scale: [1, 1.08, 1] } : undefined}
                    transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity }}
                  />
                  {agentArrival !== undefined && (
                    <motion.span
                      key={stepIndex}
                      className={styles.coreRipple}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: [0.8, 0], scale: [0.6, 1.5] }}
                      transition={{ duration: 1, ease: 'easeOut', delay: agentArrival }}
                    />
                  )}
                  <span className={styles.coreLabel}>{labels.layers.agent}</span>
                </motion.div>
              </Billboard>
            </div>
            <div className={styles.slot} style={at(OPERATOR.x, OPERATOR.y)}>
              <Node
                camera={camera}
                icon={config.operatorIcon}
                label={labels.layers.operator}
                entered={entered}
                entranceDelay={nodeDelay('agent', 1)}
                arrival={arrival('operator')}
                rippleKey={stepIndex}
              />
            </div>
          </Layer>

          {/* Channels (top) */}
          <Layer z={LAYER_Z.channels} delay={INTRO.layerDelay.channels} entered={entered}>
            <Surface
              label={labels.layers.channels}
              focused={step.focus === 'channels'}
              entered={entered}
              delay={INTRO.layerDelay.channels}
              connectors={BACK_ROW}
            />
            {BACK_ROW.map((point, i) => (
              <div key={i} className={styles.slot} style={at(point.x, point.y)}>
                <Node
                  camera={camera}
                  icon={config.channelIcons[i]}
                  label={labels.channels[i]}
                  entered={entered}
                  entranceDelay={nodeDelay('channels', i)}
                  arrival={arrival(`channel-${i}` as DemoNodeRef)}
                  rippleKey={stepIndex}
                />
              </div>
            ))}
          </Layer>

          {/* Vertical spine: the rotation sits on a plain span (framer-motion
              owns `transform` on motion elements); the inner line draws up. */}
          <span className={styles.spine} style={{ height: LAYER_Z.channels }}>
            <motion.span
              className={styles.spineLine}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: entered ? 1 : 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: INTRO.spine }}
            />
          </span>

          {/* Packet with a two-dot comet trail */}
          {showPacket && (
            <>
              <Packet camera={camera} plan={plan} lag={0.12} size="tail" fadeKey={stepIndex} teleport={teleport} />
              <Packet camera={camera} plan={plan} lag={0.06} size="trail" fadeKey={stepIndex} teleport={teleport} />
              <Packet camera={camera} plan={plan} lag={0} size="head" fadeKey={stepIndex} teleport={teleport} />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export { DemoScene };
export type { DemoSceneLabels };
