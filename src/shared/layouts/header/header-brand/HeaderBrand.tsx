import type { HeaderStaticData } from '../header-content';
import { Logo } from '@/src/shared/components/logo/Logo';
import { CustomLink } from '@/src/shared/components/custom-link/CustomLink';

import styles from './header-brand.module.css';

type HeaderBrandProps = { brand: HeaderStaticData['brand'] };

const HeaderBrand = ({ brand }: HeaderBrandProps) => {
  return (
    <CustomLink to="/" className={styles.root} ariaLabel={`${brand.name} home`}>
      <Logo alt={brand.name} width={240} height={28} mobileHeight={24} />
    </CustomLink>
  );
};

export { HeaderBrand };
