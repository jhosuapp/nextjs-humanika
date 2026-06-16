/**
 * Brand phrases shown during the page transition overlay (instead of the page
 * name). One is picked at random each time the transition mounts.
 *
 * Kept here as a constant — like `routes.constant.ts` — rather than in i18n,
 * since the transition component receives no `t` prop. Keyed by locale so the
 * phrase still matches the active language (`router.locale`), defaulting to es.
 */
const transitionPhrases: Record<string, ReadonlyArray<string>> = {
  es: [
    "Explota tu potencial",
    "Colaboradores digitales, no chatbots",
    "IA que entiende tu negocio",
    "Tu conocimiento, siempre disponible",
    "Conversaciones que trabajan por ti",
    "Inteligencia con propósito",
    "Diseñado para ayudar",
    "La IA que sí resuelve",
    "Más allá de responder",
  ],
  en: [
    "Unleash your potential",
    "Digital coworkers, not chatbots",
    "Automate. Augment. Operate.",
    "AI that understands your business",
    "Your knowledge, always available",
    "Conversations that work for you",
    "Intelligence with purpose",
    "Designed to help",
    "AI that actually solves",
    "Beyond answering",
  ],
};

const DEFAULT_LOCALE = "es";

/** Picks a random brand phrase for the given locale (falls back to es). */
const getRandomTransitionPhrase = (locale?: string): string => {
  const phrases =
    transitionPhrases[locale ?? DEFAULT_LOCALE] ??
    transitionPhrases[DEFAULT_LOCALE];
  return phrases[Math.floor(Math.random() * phrases.length)];
};

// Chosen once per page load and reused for the whole session, so every page
// transition shows the same phrase until the page is reloaded. Cleared on a
// full reload because the module is re-evaluated. Cached per locale so a
// language switch still yields a stable phrase for that language.
let sessionPhrase: { locale: string; phrase: string } | null = null;

/**
 * Returns the session's brand phrase, picking one at random the first time and
 * reusing it on every subsequent call within the same page load.
 */
const getSessionTransitionPhrase = (locale?: string): string => {
  const key = locale ?? DEFAULT_LOCALE;
  if (sessionPhrase?.locale === key) return sessionPhrase.phrase;

  const phrase = getRandomTransitionPhrase(key);
  sessionPhrase = { locale: key, phrase };
  return phrase;
};

export {
  transitionPhrases,
  getRandomTransitionPhrase,
  getSessionTransitionPhrase,
};
