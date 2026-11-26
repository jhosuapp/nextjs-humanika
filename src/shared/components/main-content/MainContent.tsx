import type { JSX } from 'react';
import { motion } from 'framer-motion';

import styles from './main-content.module.css';
import { fadeUpMotion } from '../../motion/fadeUp.motion';

type MainContentProps ={
  children: React.ReactNode;
  className?: string;
}

const MainContent = ({ children, className = '' }:MainContentProps):JSX.Element => {
  return (
    // No entrance: the page is visible from the first paint (better LCP, and
    // nothing hidden for crawlers). Heroes and sections run their own reveals;
    // the exit is kept so page changes still slide out with the curtain.
    <motion.main
      id='main-content'
      className={`${styles.mainContent} ${className}`}
      {...fadeUpMotion(0.56, 0.13)}
      initial={false}
    >
      {children}
    </motion.main>
  )
}

export { MainContent }