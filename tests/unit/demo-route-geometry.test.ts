import { describe, expect, it } from "vitest";

import {
  BACK_ROW,
  NODES,
  ROW,
  connector,
} from "@/src/features/products/components/product-demo/demo-geometry";
import { PACKET, planRoute } from "@/src/features/products/components/product-demo/demo-route";

describe("demo geometry", () => {
  it("connector returns integer widths and 2-decimal angles (SSR = client)", () => {
    [...ROW, ...BACK_ROW].forEach((point) => {
      const { width, angle } = connector(point);
      expect(Number.isInteger(width)).toBe(true);
      expect(Math.round(angle * 100) / 100).toBe(angle);
    });
  });

  it("keeps the agent above the sources and below the channels", () => {
    expect(NODES.agent.z).toBeGreaterThan(NODES["sources-hub"].z);
    expect(NODES["channels-hub"].z).toBeGreaterThan(NODES["sources-hub"].z);
  });
});

describe("planRoute (light packet)", () => {
  const route = ["channel-1", "channels-hub", "agent", "operator"] as const;
  const plan = planRoute([...route]);

  it("produces normalized, increasing keyframe times", () => {
    expect(plan.times[0]).toBe(0);
    expect(plan.times.at(-1)).toBeCloseTo(1, 10);
    plan.times.slice(1).forEach((t, i) => expect(t).toBeGreaterThan(plan.times[i]));
    expect(plan.times).toHaveLength(route.length);
  });

  it("clamps the trip duration to the readable range", () => {
    expect(plan.duration).toBeGreaterThanOrEqual(PACKET.min);
    expect(plan.duration).toBeLessThanOrEqual(PACKET.max);
  });

  it("one easing per segment: in → cruise → out", () => {
    expect(plan.ease).toEqual(["easeIn", "linear", "easeOut"]);
    expect(planRoute(["agent", "operator"]).ease).toEqual(["easeInOut"]);
  });

  it("lights each node when the packet arrives, in order", () => {
    const first = plan.arrivals.get("channel-1")!;
    const agent = plan.arrivals.get("agent")!;
    const operator = plan.arrivals.get("operator")!;
    expect(first).toBe(PACKET.delay);
    expect(agent).toBeGreaterThan(first);
    expect(operator).toBeCloseTo(PACKET.delay + plan.duration, 10);
  });

  it("keeps the first arrival when a node is visited twice", () => {
    const loop = planRoute(["agent", "sources-hub", "source-1", "sources-hub", "agent"]);
    expect(loop.arrivals.get("agent")).toBe(PACKET.delay);
  });
});
