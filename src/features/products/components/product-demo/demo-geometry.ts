import type { DemoNodeRef } from "@/src/features/products/types/product.types";

type Point3D = { x: number; y: number; z: number };

/** Side of each square layer, in px (scene space, before responsive scale). */
const PLANE = 320;

/** Height of each layer above the base plane. */
const LAYER_Z = { sources: 0, agent: 200, channels: 400 } as const;

/** Base camera angles (deg): the plane is spun on Z, then tilted on X. */
const CAMERA = { rotateX: 58, rotateZ: -40, introRotateZ: -78 } as const;

/**
 * Point on a plane at `screenAngle` (deg, 0 = right, 90 = towards the viewer)
 * once the camera spin is applied, so nodes spread evenly on screen.
 */
const polar = (screenAngle: number, radius: number) => {
  const rad = ((screenAngle - CAMERA.rotateZ) * Math.PI) / 180;
  return {
    x: Math.round(Math.cos(rad) * radius),
    y: Math.round(Math.sin(rad) * radius),
  };
};

/** Sources fan out on the front edge (left, front, right)… */
const ROW = [polar(150, 118), polar(95, 116), polar(35, 118)] as const;

/** …channels on the back edge, so they never hide the agent core. */
const BACK_ROW = [polar(-150, 118), polar(-95, 116), polar(-35, 118)] as const;

const OPERATOR = polar(5, 124);

const NODES: Record<DemoNodeRef, Point3D> = {
  "channel-0": { ...BACK_ROW[0], z: LAYER_Z.channels },
  "channel-1": { ...BACK_ROW[1], z: LAYER_Z.channels },
  "channel-2": { ...BACK_ROW[2], z: LAYER_Z.channels },
  "channels-hub": { x: 0, y: 0, z: LAYER_Z.channels },
  // Lifted so the packet ends inside the floating orb, not at its base.
  agent: { x: 0, y: 0, z: LAYER_Z.agent + 78 },
  operator: { ...OPERATOR, z: LAYER_Z.agent },
  "sources-hub": { x: 0, y: 0, z: LAYER_Z.sources },
  "source-0": { ...ROW[0], z: LAYER_Z.sources },
  "source-1": { ...ROW[1], z: LAYER_Z.sources },
  "source-2": { ...ROW[2], z: LAYER_Z.sources },
};

/** Flat connector from the plane centre to a point on the same plane. */
const connector = (to: { x: number; y: number }) => ({
  // Rounded so server and client serialize the exact same inline style
  // (otherwise float precision triggers a hydration mismatch warning).
  width: Math.round(Math.hypot(to.x, to.y)),
  angle: Math.round(((Math.atan2(to.y, to.x) * 180) / Math.PI) * 100) / 100,
});

export { BACK_ROW, CAMERA, LAYER_Z, NODES, OPERATOR, PLANE, ROW, connector };
export type { Point3D };
