# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # start production server
npm run lint     # run ESLint
```

## Architecture

This project uses a **feature-based architecture** under `src/`.

```
src/
  features/<feature>/     # one folder per route/feature
    views/                # <Feature>.view.tsx — the root component for the feature
    components/           # UI components scoped to this feature
    actions/              # server/client actions
    hooks/                # hooks scoped to this feature
    stores/               # Zustand stores scoped to this feature
  shared/
    components/           # globally reusable UI components
    stores/               # global Zustand stores
    hooks/                # global hooks
    helpers/              # utility functions
    libs/                 # third-party wrappers (axios instance, etc.)
app/
  <route>/page.tsx        # thin shell — imports and renders the feature View, nothing else
```

### Key conventions

**`/app` pages are shells.** All logic, state, and markup live in the feature. A page file should only import and render the View:

```tsx
// app/page.tsx
import { HomeView } from "@/src/features/home/views/Home.view";
export default function Home() {
  return <HomeView />;
}
```

**View files are named `<Feature>.view.tsx`** and exported as named exports.

**Path alias:** `@/*` maps to the repo root, so use `@/src/...` for imports.

## Styling

- **Tailwind v4** via `@import "tailwindcss"` in `globals.css`.
- **Never use inline Tailwind classes** in `.tsx` files for component-level styles. Use `*.module.css` files instead.
- Layout/structural one-offs (flex, grid on a wrapper) can use Tailwind utility classes inline, but all design-token–based styles (colors, spacing rhythm, typography) must go through the module file.
- Color palette is defined in `app/globals.css` under `@theme inline`. **Always use palette tokens** (`bg-background`, `text-foreground`, etc.) — never raw hex values or arbitrary Tailwind colors.
- Module CSS files use `@reference "tailwindcss"` at the top to access `@apply` with Tailwind utilities.

## Animations

**All page and component animations must use [framer-motion](https://www.framer.com/motion/).** Do not use CSS transitions/keyframes or other JS animation libraries for anything beyond static hover effects. Use `motion.*` components and `AnimatePresence` for enter/exit transitions.

### Scroll reveals: one language for the whole site

Every element that appears on scroll uses the `REVEAL` tokens in `src/shared/helpers/motion-variants.ts`: fade + 24px rise, 0.6s tween with `EASE`, fired once at 15% visibility, children staggered by `REVEAL.stagger`, header cascades via `revealDelay(i)`. Never hard-code those numbers.

- **Primitives (pick one per element):** `Reveal` / `RevealGroup` / `RevealItem` (`shared/components/motion/Reveal.tsx`), `FadeIn`, `StaggerGroup` / `StaggerItem`, `SectionHeader` for section heads, and `Text` / `WrapperMotion` (on scroll they use the same tokens via `shared/motion/reveal.motion.ts`).
- **Never nest animations:** if a parent reveals (`StaggerItem`, `Reveal`, a card wrapper), its texts use `<Text noMotion>`. Don't wrap `SectionHeader` or animated `Text` in `FadeIn`.
- **`immediate` is only for page heroes** (and above-the-fold content next to them): it plays on mount, timed with the `PageTransition` curtain (`fadeUpMotion` delays ≈ 0.52–0.61s, exits cascade bottom → top). Below the fold, never use `immediate`: it animates off-screen.
- **Don't reveal very tall containers** (whole documents, long lists): reveal their children instead — a tall element may never reach the in-view threshold.
- **`MainContent` has no entrance** (only the exit for page changes): the page must be visible on first paint.
- **Reduced motion** is handled globally by `<MotionConfig reducedMotion="user">` in `_app.tsx`; Lenis also switches to native scroll. Don't read `useReducedMotion()` into initial state (it's `null` on the first render) — derive from it instead.
- **3D scenes:** never animate `opacity` on an element that contains `preserve-3d` children (it flattens them); avoid `backdrop-filter` / `filter: blur()` inside 3D stacks (iOS Safari crashes).
- **Bespoke motion** (ProductDemo 3D, ProcessSteps, Parallax, Marquee, AnimatedCounter, PageTransition) is allowed, but still uses `EASE` / `REVEAL.amount` where it has a scroll trigger.

## State management

Zustand v5 is the only store solution. Place stores in `src/shared/stores/` if global, or `src/features/<feature>/stores/` if scoped to one feature.

## HTTP

Use the Axios instance in `src/shared/libs/` for all HTTP calls. Do not use `fetch` directly.

## Barrel files

**Barrel files (`index.ts` / `index.tsx`) are strictly forbidden.** They force bundlers and the TypeScript compiler to load entire module trees eagerly, which hurts build times, cold-start performance, and tree-shaking. Always import directly from the source file:

```ts
// correct
import { HomeView } from "@/src/features/home/views/Home.view";

// forbidden — never create or import from an index file
import { HomeView } from "@/src/features/home";
```

Do not create `index.ts` or `index.tsx` anywhere in the project.

## Internationalisation (i18n)

**Stack:** `next-i18next` v16 (Pages Router). Locales: `es` (default), `en`, `pt`, `fr`, `de`. Translation files live in `public/locales/{locale}/{namespace}.json`.

### Namespaces

| Namespace   | Loaded by                   | Contains                          |
| ----------- | --------------------------- | --------------------------------- |
| `common`    | every page (`_app.tsx`)     | nav, header, footer, SEO defaults |
| `home`      | `pages/index.tsx`           | home page copy                    |
| `<feature>` | `pages/<feature>/index.tsx` | copy scoped to that feature       |

### Loading translations (server-side only)

Always load via `getStaticProps` — never client-side. Import paths for v16:

```ts
import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", ["common", "home"])),
    },
  };
}
```

### `t` prop propagation

`useTranslation` is called **only in page files and `_app.tsx`**, never inside shared components. Pass `t` down as a prop typed `ITranslations` (`src/shared/interfaces/i18n.interface.ts`).

```tsx
// pages/index.tsx
const { t } = useTranslation("home");
return <HomeView t={t} />;

// Home.view.tsx
import type { ITranslations } from "@/src/shared/interfaces/i18n.interface";
type HomeViewProps = { t: ITranslations };
const HomeView = ({ t }: HomeViewProps) => <HeroSection t={t} />;
```

`_app.tsx` calls `useTranslation('common')` and passes `t` to `<Header>` and `<Footer>`.

### Data files vs. translation files

- **Text strings** → JSON locale files (never hardcoded in `.ts`/`.tsx`).
- **Structural data** (icons, hrefs, ids) → stays in the TypeScript data file (e.g., `home-content.ts`, `header-content.ts`).
- Data file exports are named `*StaticData` (e.g., `homeStaticData`, `headerStaticData`).

### Arrays with `returnObjects`

For translation keys that hold arrays (bullets, highlights), use `returnObjects: true`:

```ts
const items = t("hero.highlights", { returnObjects: true }) as string[];
```

### Language switching

Use `useRouter` — **not** a Zustand store:

```ts
const router = useRouter();
router.push(router.pathname, router.asPath, { locale: code });
const currentLocale = router.locale ?? "es";
```

### Adding a new page

1. Create `public/locales/{es,en,pt,fr,de}/<feature>.json` with the same keys in each locale.
2. Add `getStaticProps` to the page with `serverSideTranslations(locale, ['common', '<feature>'])`.
3. Call `useTranslation('<feature>')` in the page, pass `t` to the View.

## SEO / Page head

Every page wraps its content in `PageLayout` (`src/shared/layouts/page-layout/PageLayout.tsx`) instead of using `<Head>` directly. This handles the full SEO head: canonical URL, Open Graph, Twitter card, JSON-LD schema, robots, and theme-color.

```tsx
import { PageLayout } from "@/src/shared/layouts/page-layout/PageLayout";

export default function MyPage() {
  const { t } = useTranslation("common");
  return (
    <PageLayout
      title={t("seo.myTitle") as string}
      description={t("seo.myDescription") as string}
      // image="/images/custom-og.png"  optional, defaults to SITE_OG_IMAGE
      // hasNoIndex                     add for auth-gated or draft pages
    >
      <PageTransition>
        <MyView t={t} />
      </PageTransition>
    </PageLayout>
  );
}
```

SEO translation keys go in the `seo.*` namespace inside `common.json` (available on every page via `useTranslation('common')`). Site-level constants (`SITE_URL`, `SITE_NAME`, `SITE_OG_IMAGE`) live in `src/config/site.ts`.
