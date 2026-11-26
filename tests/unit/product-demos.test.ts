import { describe, expect, it } from "vitest";

import { productsStaticData } from "@/src/features/products/data/products.registry";
import { NODES } from "@/src/features/products/components/product-demo/demo-geometry";

import { readLocale } from "./helpers/site-routes";

const es = readLocale("es", "products");
const en = readLocale("en", "products");

describe("3D demo config (all 18 products)", () => {
  it("every product has a demo with 4 steps", () => {
    productsStaticData.forEach((p) => {
      expect(p.demo, p.slug).toBeDefined();
      expect(p.demo!.steps).toHaveLength(4);
      expect(p.demo!.channelIcons).toHaveLength(3);
      expect(p.demo!.sourceIcons).toHaveLength(3);
    });
  });

  it("every route node exists in the scene geometry", () => {
    productsStaticData.forEach((p) =>
      p.demo!.steps.forEach((step) =>
        step.route.forEach((ref) => expect(NODES[ref], `${p.slug}: ${ref}`).toBeDefined()),
      ),
    );
  });

  it("each step starts where the previous one ended (no packet jumps)", () => {
    productsStaticData.forEach((p) => {
      const steps = p.demo!.steps;
      for (let i = 1; i < steps.length; i++) {
        const prevEnd = steps[i - 1].route.at(-1);
        expect(steps[i].route[0], `${p.slug} step ${i + 1}`).toBe(prevEnd);
      }
    });
  });

  it("visible chat lines never decrease and end at the full script", () => {
    productsStaticData.forEach((p) => {
      const counts = p.demo!.steps.map((s) => s.messages);
      counts.slice(1).forEach((c, i) => expect(c).toBeGreaterThanOrEqual(counts[i]));
      for (const [loc, json] of [["es", es], ["en", en]] as const) {
        const demo = json.items[p.slug].demo;
        expect(demo, `${loc} ${p.slug}`).toBeDefined();
        expect(counts.at(-1), `${loc} ${p.slug} chat length`).toBe(demo.chat.length);
      }
    });
  });

  it("has complete copy in both locales (steps, nodes, layers)", () => {
    productsStaticData.forEach((p) => {
      for (const json of [es, en]) {
        const demo = json.items[p.slug].demo;
        expect(demo.steps).toHaveLength(4);
        expect(demo.channels).toHaveLength(3);
        expect(demo.sources).toHaveLength(3);
        expect(Object.keys(demo.layers).sort()).toEqual(["agent", "channels", "operator", "sources"]);
        demo.chat.forEach((line: { from: string; text: string }) => {
          expect(["user", "bot", "system"]).toContain(line.from);
          expect(line.text.trim().length).toBeGreaterThan(0);
        });
      }
    });
  });
});
