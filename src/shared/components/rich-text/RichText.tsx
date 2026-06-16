import { motion, useReducedMotion } from 'framer-motion';
import type { JSX } from 'react';

import { staggerParent, staggerChild } from '@/src/shared/helpers/motion-variants';
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

const RichText = ({ blocks, className = '' }: RichTextProps): JSX.Element => {
  const reduce = useReducedMotion();

  const parentVariants = staggerParent(0.06, 0.05);
  const childVariants = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } }
    : staggerChild;

  return (
    <motion.div
      className={`${styles.root} ${className}`}
      variants={parentVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.04 }}
    >
      {blocks.map((block, i) => {
        if (block.type === 'divider') {
          return (
            <motion.div key={i} variants={childVariants}>
              <hr className={styles.divider} />
            </motion.div>
          );
        }

        if (block.type === 'h1' || block.type === 'h2' || block.type === 'h3' ||
            block.type === 'h4' || block.type === 'h5' || block.type === 'h6') {
          const Tag = block.type;
          return (
            <motion.div key={i} variants={childVariants}>
              <Tag className={styles[block.type]}>{block.text}</Tag>
            </motion.div>
          );
        }

        if (block.type === 'p') {
          return (
            <motion.div key={i} variants={childVariants}>
              <p className={styles.p}>{block.text}</p>
            </motion.div>
          );
        }

        if (block.type === 'ul' || block.type === 'ol') {
          const ListTag = block.type;
          return (
            <motion.div key={i} variants={childVariants}>
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
            <motion.div key={i} variants={childVariants}>
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
    </motion.div>
  );
};

export { RichText };
export type { RichTextBlock };
