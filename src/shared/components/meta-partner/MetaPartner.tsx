import Image from 'next/image';
import { Container } from '@/src/features/home/components/container/Container';
import type { JSX } from 'react';

import styles from './meta-partner.module.css';
import { Text } from '../text/Text';
import { WrapperMotion } from '../wrapper-motion/WrapperMotion';

const MetaPartner = ():JSX.Element => {
  return (
    <WrapperMotion fadeUpTertiary delay={{ enter:0, exit: 0 }}>
      <Container padding='xl'>
          <article className={ styles.metaPartner }>
            <Image className={ styles.metaPartner__image } src={'/svg/logo-150.svg'} width={160} height={58} alt='150porciento' />
            <Text 
                tag="p" 
                variant="subtitle_small" 
                color="secondary"
                weight='bold'
                fadeUpTertiary
                immediate
                className={ styles.metaPartner__text }
            >
              Official Meta Tech Partner
            </Text>
            <Image className={ styles.metaPartner__image } src={'/svg/logo-meta.svg'} width={160} height={32} alt='Meta' />
            <Image className={ styles.metaPartner__pill } src={'/svg/pill-meta-1.svg'} width={700} height={200} alt='Pill' />
            <Image className={ styles.metaPartner__pill__secondary } src={'/svg/pill-meta-2.svg'} width={700} height={200} alt='Pill' />
          </article>
      </Container>
    </WrapperMotion>
  )
}

export { MetaPartner }