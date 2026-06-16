import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

import { FadeIn } from '@/src/shared/components/motion/FadeIn';
import {
  StaggerGroup,
  StaggerItem,
} from '@/src/shared/components/motion/StaggerGroup';
import { DURATION, EASE, REVEAL, revealDelay } from '@/src/shared/helpers/motion-variants';
import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { homeStaticData } from '@/src/features/home/data/home-content';
import { Button } from '@/src/shared/components/button/Button';
import { Text } from '@/src/shared/components/text/Text';
import { Container } from '../container/Container';
import { WrapperMotion } from '@/src/shared/components/wrapper-motion/WrapperMotion';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

import styles from './faq-section.module.css';

type Props = { t: ITranslations };

type AccordionItemProps = {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

const AccordionItem = ({ id, question, answer, isOpen, onToggle }: AccordionItemProps) => {
  const reduce = useReducedMotion();
  const panelId = `faq-panel-${id}`;
  const buttonId = `faq-trigger-${id}`;

  return (
    <div className={`${styles.item} gl-gradient-box`} data-open={isOpen}>
      <h3 className={styles.itemHeading}>
        <button
          id={buttonId}
          type="button"
          className={styles.trigger}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className={styles.question}>{question}</span>
          <motion.span
            className={styles.chevron}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.25, ease: EASE }
            }
            aria-hidden="true"
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="panel"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className={styles.panel}
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
            transition={{
              height: { duration: DURATION.fast, ease: EASE },
              opacity: { duration: 0.2, ease: EASE },
            }}
          >
            <Text
              className={ styles.answer }
              tag="p" 
              variant="description_small" 
              color="muted"
              delay={{ enter: 0, exit: 0 }}
              fadeUpTertiary
            >
              {answer}
            </Text>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

const FaqSection = ({ t }: Props) => {
  const { faq } = homeStaticData;
  const [openIds, setOpenIds] = useState<ReadonlyArray<string>>([
    faq.items[0]?.id ?? '',
  ]);

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className={styles.bg}>
      <Container id="faqs" className={styles.section} aria-labelledby="faq-title" padding='xl'>
        <FadeIn className={styles.header} y={16}>
          <Text
            tag="p" 
            variant="description_xs" 
            color="primary"
            weight="semibold"
            delay={{ enter: revealDelay(0), exit: 0 }}
            fadeUpTertiary
          >
            {t('faq.eyebrow')}
          </Text>
          <Text
            tag="h2" 
            variant="title_small" 
            color="secondary"
            weight="semibold"
            delay={{ enter: revealDelay(1), exit: 0 }}
            fadeUpTertiary
          >
            {t('faq.title')}
          </Text>
          <Text
            className={styles.headerDescription}
            tag="p" 
            variant="description" 
            color="muted"
            delay={{ enter: revealDelay(2), exit: 0 }}
            fadeUpTertiary
          >
            {t('faq.description')}
          </Text>
        </FadeIn>
        <WrapperMotion delay={{ enter: 0.1, exit: 0 }} fadeUpTertiary>
          <StaggerGroup className={styles.list} stagger={REVEAL.stagger} amount={REVEAL.amount}>
            {faq.items.map((item) => (
              <StaggerItem key={item.id}>
                <AccordionItem
                  id={item.id}
                  question={t(`faq.items.${item.id}.question`) as string}
                  answer={t(`faq.items.${item.id}.answer`) as string}
                  isOpen={openIds.includes(item.id)}
                  onToggle={() => toggle(item.id)}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </WrapperMotion>

        <div className={styles.footer}>
          <Text
            tag="p" 
            variant="description_small" 
            color="muted"
            delay={{ enter: 0, exit: 0 }}
            immediate
          >
            {t('faq.stillHaveQuestion')}
          </Text>
          <Button
            text={t('faq.contactCta') as string}
            style="whatsapp"
            type="button"
            iconRight={ faWhatsapp }
          />
        </div>
      </Container>
    </div>
  );
};

export { FaqSection };
