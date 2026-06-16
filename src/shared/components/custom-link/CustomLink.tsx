import Link from 'next/link';
import { useRouter } from 'next/router';
import type { JSX, MouseEvent, ReactNode } from 'react';

import { useLenisStore } from '@/src/shared/stores/lenis.store';
import { navigateToHash } from '@/src/shared/helpers/hash-navigation';

type CustomLinkProps = {
  /** Internal route ("/blog/slug"), hash ("/#section" or "#section") or URL. */
  to: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  /** Renders a plain new-tab anchor and skips the internal Lenis navigation. */
  external?: boolean;
  /** Fires once navigation is triggered — e.g. to close the mobile menu. */
  onNavigate?: () => void;
  /** Lenis scroll-to-top duration for page changes, in seconds. */
  scrollDuration?: number;
  'aria-current'?: 'page' | 'true' | undefined;
};

/**
 * Internal navigation link. Renders a real `<a href>` (via next/link) so the
 * link stays crawlable, focusable and openable in a new tab, while intercepting
 * left clicks to drive a Lenis smooth scroll before routing:
 *   - hash links smooth-scroll to the section, routing to home first if needed
 *     (see `navigateToHash`);
 *   - page links scroll to the top, then push the route.
 * Modified clicks (cmd/ctrl/middle/…) fall through to the browser.
 */
const CustomLink = ({
  to,
  children,
  className = '',
  ariaLabel,
  external = false,
  onNavigate,
  scrollDuration = 0.7,
  'aria-current': ariaCurrent,
}: CustomLinkProps): JSX.Element => {
  const router = useRouter();
  const lenis = useLenisStore((state) => state.lenis);

  if (external) {
    return (
      <a
        href={to}
        className={className}
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Let the browser handle new-tab / modified clicks natively.
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    e.preventDefault();

    if (navigateToHash(to, router, lenis, onNavigate)) return;

    lenis?.scrollTo(0, { duration: scrollDuration });
    setTimeout(() => {
      router.push(to);
      onNavigate?.();
    }, scrollDuration * 1000);
  };

  return (
    <Link
      href={to}
      className={className}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export { CustomLink };
export type { CustomLinkProps };
