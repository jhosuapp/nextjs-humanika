import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { EASE, REVEAL, revealDelay } from "@/src/shared/helpers/motion-variants";
import { revealMotion } from "@/src/shared/motion/reveal.motion";

import { ROOT } from "./helpers/site-routes";

describe("REVEAL tokens (single scroll-reveal language)", () => {
  it("defines the agreed values", () => {
    expect(REVEAL).toMatchObject({ y: 24, duration: 0.6, amount: 0.15, once: true, stagger: 0.08, step: 0.08 });
    expect(REVEAL.ease).toBe(EASE);
  });

  it("revealDelay cascades by REVEAL.step without float noise", () => {
    expect([0, 1, 2, 3].map(revealDelay)).toEqual([0, 0.08, 0.16, 0.24]);
  });

  it("revealMotion (Text / WrapperMotion on scroll) uses the tokens", () => {
    const motion = revealMotion(0.16, 0.1) as {
      initial: { opacity: number; y: number };
      animate: { transition: { duration: number; ease: unknown; delay: number } };
    };
    expect(motion.initial).toEqual({ opacity: 0, y: REVEAL.y });
    expect(motion.animate.transition).toEqual({ duration: REVEAL.duration, ease: REVEAL.ease, delay: 0.16 });
  });
});

describe("no hard-coded reveal numbers in the code base", () => {
  /** Files kept on purpose: internal dashboard and unrendered legacy sections. */
  const ALLOWED = [
    "features/dashboard/",
    "features/home/components/pricing-section/",
    "features/home/components/case-studies-section/",
    "features/home/components/agentic-videos-section/",
  ];

  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".tsx")) files.push(full);
    }
  };
  walk(path.join(ROOT, "src"));

  const rel = (file: string) => path.relative(path.join(ROOT, "src"), file);
  const scanned = files.filter((f) => !ALLOWED.some((a) => rel(f).startsWith(a)));

  it.each([
    ["stagger literal on StaggerGroup", /<StaggerGroup[^>]*\bstagger=\{0\.\d+\}/],
    ["amount literal on StaggerGroup/FadeIn", /<(StaggerGroup|FadeIn)[^>]*\bamount=\{0\.\d+\}/],
    ["custom y offset on FadeIn", /<FadeIn[^>]*\by=\{\d+\}/],
    ["viewport amount literal in whileInView", /viewport=\{\{[^}]*amount:\s*0\.\d+/],
  ])("%s", (_, pattern) => {
    const offenders = scanned.filter((f) => pattern.test(fs.readFileSync(f, "utf8"))).map(rel);
    expect(offenders).toEqual([]);
  });

  it("SectionHeader is never wrapped in FadeIn (double animation)", () => {
    const offenders = scanned
      .filter((f) => /<FadeIn[^>]*>\s*<SectionHeader/.test(fs.readFileSync(f, "utf8")))
      .map(rel);
    expect(offenders).toEqual([]);
  });
});
