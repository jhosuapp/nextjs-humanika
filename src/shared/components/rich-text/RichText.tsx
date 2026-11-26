import { motion, type Variants } from 'framer-motion';
import type { JSX } from 'react';

import { REVEAL } from '@/src/shared/helpers/motion-variants';
import { CustomLink } from '@/src/shared/components/custom-link/CustomLink';

import styles from './rich-text.module.css';

type RichTextBlock =
  | { type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'link'; text: string; href: string; external?: boolean }
  | { type: 'divider' };

type RichTextProps = {
  blocks: RichTextBlock[];
  className?: string;
};

/**
 * Each block reveals on its own as it scrolls in (REVEAL tokens). The whole
 * document is NOT revealed as one unit: a tall container may never reach the
 * in-view threshold (legal pages are several screens long).
 */
const blockVariants: Variants = {
  hidden: { opacity: 0, y: REVEAL.y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL.duration, ease: REVEAL.ease },
  },
};

const blockMotion = {
  variants: blockVariants,
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: REVEAL.once, amount: REVEAL.amount },
} as const;

const RichText = ({ blocks, className = '' }: RichTextProps): JSX.Element => {
  return (
    <div className={`${styles.root} ${className}`}>
      {blocks.map((block, i) => {
        if (block.type === 'divider') {
          return (
            <motion.div key={i} {...blockMotion}>
              <hr className={styles.divider} />
            </motion.div>
          );
        }

        if (block.type === 'h1' || block.type === 'h2' || block.type === 'h3' ||
            block.type === 'h4' || block.type === 'h5' || block.type === 'h6') {
          const Tag = block.type;
          return (
            <motion.div key={i} {...blockMotion}>
              <Tag className={styles[block.type]}>{block.text}</Tag>
            </motion.div>
          );
        }

        if (block.type === 'p') {
          return (
            <motion.div key={i} {...blockMotion}>
              <p className={styles.p}>{block.text}</p>
            </motion.div>
          );
        }

        if (block.type === 'ul' || block.type === 'ol') {
          const ListTag = block.type;
          return (
            <motion.div key={i} {...blockMotion}>
              <ListTag className={styles[block.type]}>
                {block.items.map((item, j) => (
                  <li key={j} className={styles.li}>{item}</li>
                ))}
              </ListTag>
            </motion.div>
          );
        }

        if (block.type === 'link') {
          return (
            <motion.div key={i} {...blockMotion}>
              <CustomLink
                to={block.href}
                className={styles.linkBlock}
                external={block.external}
              >
                {block.text}
              </CustomLink>
            </motion.div>
          );
        }

        return null;
      })}
    </div>
  );
};

export { RichText };
export type { RichTextBlock };
