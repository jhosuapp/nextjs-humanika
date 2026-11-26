import type { Easing } from "framer-motion";

import type { DemoNodeRef } from "@/src/features/products/types/product.types";

import { NODES, type Point3D } from "./demo-geometry";

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
      ? ["easeInOut"]
      : segments.map((_, i) =>
          i === 0 ? "easeIn" : i === segments.length - 1 ? "easeOut" : "linear",
        );

  return { points, times, duration, ease, arrivals };
};

type RoutePlan = ReturnType<typeof planRoute>;

export { PACKET, distance, planRoute };
export type { RoutePlan };
