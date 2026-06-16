import Link from 'next/link';
import { useRouter } from 'next/router';

import type { HeaderStaticData } from '../header-content';
import { useLenisStore } from '@/src/shared/stores/lenis.store';
import { Logo } from '@/src/shared/components/logo/Logo';

import styles from './header-brand.module.css';

type HeaderBrandProps = { brand: HeaderStaticData['brand'] };

const HeaderBrand = ({ brand }: HeaderBrandProps) => {
  const router = useRouter();
  const lenis = useLenisStore(state => state.lenis);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (router.pathname === '/') {
      e.preventDefault();
      lenis?.scrollTo(0, { duration: 0.7 });
    }
  };

  return (
    <Link
      href="/"
      className={styles.root}
      aria-label={`${brand.name} home`}
      onClick={handleClick}
    >
      <Logo alt={brand.name} width={240} height={28} mobileHeight={24} />
    </Link>
  );
};

export { HeaderBrand };
