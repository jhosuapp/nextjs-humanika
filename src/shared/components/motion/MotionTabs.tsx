import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { DURATION, EASE } from '@/src/shared/helpers/motion-variants';
import { cn } from '@/src/shared/libs/cn';

import styles from './motion-tabs.module.css';
import { WrapperMotion } from '../wrapper-motion/WrapperMotion';

type Tab<K extends string> = {
  key: K;
  label: string;
  content: ReactNode;
};

type MotionTabsProps<K extends string> = {
  tabs: ReadonlyArray<Tab<K>>;
  defaultTab?: K;
  className?: string;
  listClassName?: string;
  panelClassName?: string;
  layoutId?: string;
};

const DESKTOP_QUERY = '(min-width: 1024px)';

/**
 * Responsive tabs:
 * - Desktop (lg+): a pill tablist on top + a single shared panel that
 *   cross-fades between tabs.
 * - Mobile: an accordion — each label is a trigger and its content expands
 *   directly beneath it, so it reads as "this header controls this content".
 *
 * The layout is picked at runtime via matchMedia. We default to desktop so the
 * server render and the desktop client render match (no hydration flash on the
 * breakpoint that uses the cross-fade); mobile swaps to the accordion on mount.
 */
const MotionTabs = <K extends string>({
  tabs,
  defaultTab,
  className,
  listClassName,
  panelClassName,
  layoutId = 'motion-tabs-indicator',
}: MotionTabsProps<K>) => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<K>(defaultTab ?? tabs[0].key);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const current = tabs.find((t) => t.key === active) ?? tabs[0];

  // Mobile accordion: open the tab and scroll its header into view, just
  // below the sticky site header so the content the user opened is in frame.
  // The position is measured after the expand/collapse animation settles, so
  // it stays accurate even when the item that closes sits above this one.
  const openAccordion = (key: K) => {
    setActive(key);

    if (typeof window === 'undefined') return;

    const scrollToHeader = () => {
      const header = document.getElementById(`acc-${key}`);
      if (!header) return;

      const siteHeader = document.querySelector('header');
      const offset = (siteHeader?.getBoundingClientRect().height ?? 0) + 12;
      const top = header.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    };

    if (reduce) {
      requestAnimationFrame(scrollToHeader);
    } else {
      // Wait for the height animation (DURATION.fast) to finish reflowing.
      window.setTimeout(scrollToHeader, DURATION.fast * 1000 + 20);
    }
  };

  return (
    <WrapperMotion delay={{ enter: 0, exit: 0 }} fadeUpTertiary>
      <div className={cn(styles.root, className)}>
        {/* Desktop tablist (hidden on mobile via CSS) */}
        <div role="tablist" className={cn(styles.list, listClassName)}>
          {tabs.map((tab) => {
            const isActive = tab.key === active;
            return (
              <button
                key={tab.key}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`panel-${tab.key}`}
                id={`tab-${tab.key}`}
                tabIndex={isActive ? 0 : -1}
                className={cn(styles.tab, isActive && styles.tabActive)}
                onClick={() => setActive(tab.key)}
              >
                <span className={styles.tabLabel}>{tab.label}</span>
                {isActive ? (
                  <motion.span
                    layoutId={layoutId}
                    className={styles.indicator}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { duration: DURATION.fast, ease: EASE }
                    }
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {isDesktop ? (
          /* Desktop: single shared panel that cross-fades between tabs */
          <div className={cn(styles.panelWrapper, panelClassName)}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.key}
                role="tabpanel"
                id={`panel-${current.key}`}
                aria-labelledby={`tab-${current.key}`}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: DURATION.fast, ease: EASE }}
                className={styles.panel}
              >
                {current.content}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          /* Mobile: accordion — content expands under its own header */
          <div className={cn(styles.items, panelClassName)}>
            {tabs.map((tab) => {
              const isActive = tab.key === active;
              return (
                <div key={tab.key} className={styles.item}>
                  <button
                    type="button"
                    id={`acc-${tab.key}`}
                    aria-expanded={isActive}
                    aria-controls={`panel-${tab.key}`}
                    className={cn(
                      styles.accHeader,
                      isActive && styles.accHeaderActive,
                    )}
                    onClick={() => openAccordion(tab.key)}
                  >
                    <span>{tab.label}</span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      aria-hidden="true"
                      className={cn(
                        styles.accIcon,
                        isActive && styles.accIconOpen,
                      )}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isActive ? (
                      <motion.div
                        key="panel"
                        role="tabpanel"
                        id={`panel-${tab.key}`}
                        aria-labelledby={`acc-${tab.key}`}
                        initial={
                          reduce ? { opacity: 0 } : { height: 0, opacity: 0 }
                        }
                        animate={
                          reduce
                            ? { opacity: 1 }
                            : { height: 'auto', opacity: 1 }
                        }
                        exit={
                          reduce ? { opacity: 0 } : { height: 0, opacity: 0 }
                        }
                        transition={{ duration: DURATION.fast, ease: EASE }}
                        className={styles.accPanel}
                      >
                        <div className={styles.panelInner}>{tab.content}</div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </WrapperMotion>
  );
};

export { MotionTabs };
export type { Tab };
