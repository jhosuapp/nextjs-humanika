import type { CSSProperties } from 'react';
import Image from 'next/image';

import { useThemeStore } from '@/src/shared/stores/theme.store';

import styles from './logo.module.css';

type LogoProps = {
  alt: string;
  /** Intrinsic width passed to next/image (defines the source ratio). */
  width?: number;
  /** Rendered height on desktop. */
  height?: number;
  /** Rendered width below 640px. Omit to keep the aspect ratio. */
  mobileWidth?: number;
  /** Rendered height below 640px. */
  mobileHeight?: number;
  className?: string;
  priority?: boolean;
};

const LOGO_SRC = {
  light: '/svg/logo-humanika.svg',
  dark: '/svg/logo-white.svg',
} as const;

/** Brand logo. Swaps the asset based on the active theme and shrinks on mobile
 *  via the optional `mobile*` props. Single source of truth for the logo
 *  across header, footer and anywhere else it is used. */
const Logo = ({
  alt,
  width = 200,
  height = 33,
  mobileWidth,
  mobileHeight,
  className,
  priority,
}: LogoProps) => {
  const theme = useThemeStore((state) => state.theme);
  const src = theme === 'dark' ? LOGO_SRC.dark : LOGO_SRC.light;

  const style = {
    '--logo-h': `${height}px`,
    ...(mobileWidth ? { '--logo-w-mobile': `${mobileWidth}px` } : {}),
    ...(mobileHeight ? { '--logo-h-mobile': `${mobileHeight}px` } : {}),
  } as CSSProperties;

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      style={style}
      className={`${styles.logo} ${className ?? ''}`}
    />
  );
};

export { Logo };