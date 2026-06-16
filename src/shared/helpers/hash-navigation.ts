import type { NextRouter } from 'next/router';
import type Lenis from 'lenis';

// Matches "#section" and "/#section".
const HASH_LINK = /^\/?#(.+)$/;

// Header is fixed, so anchored sections need a top offset.
const HASH_OFFSET = -80;
// Lenis scroll duration (seconds) for in-page anchor jumps.
const HASH_DURATION = 1.1;
// Time to wait after landing on home before scrolling, so the page-transition
// curtain has revealed and the smooth scroll is actually visible.
const REVEAL_DELAY = 1000;
// When leaving another route, smooth-scroll the current page to the top first
// (duration in seconds), then route after it finishes — matching how non-hash
// links navigate, so the scroll up is smooth and not an instant jump.
const LEAVE_DURATION = 0.7;
const LEAVE_DELAY = LEAVE_DURATION * 1000;

/** True if `to` is an in-page hash link (e.g. "/#solutions"). */
const isHashLink = (to: string): boolean => HASH_LINK.test(to);

const scrollToSection = (lenis: Lenis | null, id: string) => {
  lenis?.scrollTo(`#${id}`, { duration: HASH_DURATION, offset: HASH_OFFSET });
};

/**
 * Smooth-scrolls a hash link with Lenis.
 *
 * - On home: scrolls to the section right away.
 * - Elsewhere: smooth-scrolls the current page to the top first, then routes to
 *   home (without the hash, so the browser never does its native instant jump),
 *   then smooth-scrolls to the section once the home route has mounted and the
 *   transition curtain has cleared.
 *
 * Returns `true` when `to` was a hash link and was handled, so callers can fall
 * back to normal routing otherwise.
 */
const navigateToHash = (
  to: string,
  router: NextRouter,
  lenis: Lenis | null,
  onDone?: () => void,
): boolean => {
  const match = to.match(HASH_LINK);
  if (!match) return false;

  const id = match[1];

  if (router.pathname === '/') {
    scrollToSection(lenis, id);
    onDone?.();
    return true;
  }

  const handleComplete = () => {
    router.events.off('routeChangeComplete', handleComplete);
    setTimeout(() => scrollToSection(lenis, id), REVEAL_DELAY);
  };

  router.events.on('routeChangeComplete', handleComplete);

  // Smooth-scroll up first, then route once the scroll has finished.
  lenis?.scrollTo(0, { duration: LEAVE_DURATION });
  setTimeout(() => {
    router.push('/');
    onDone?.();
  }, LEAVE_DELAY);
  return true;
};

export { isHashLink, navigateToHash };
