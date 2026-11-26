import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

import {
  StaggerGroup,
  StaggerItem,
} from '@/src/shared/components/motion/StaggerGroup';
import { DURATION, EASE, REVEAL } from '@/src/shared/helpers/motion-variants';
import type { ITranslations } from '@/src/shared/interfaces/i18n.interface';
import { homeStaticData } from '@/src/features/home/data/home-content';
import { Button } from '@/src/shared/components/button/Button';
import { Text } from '@/src/shared/components/text/Text';
import { Container } from '../container/Container';
import { SectionHeader } from '@/src/shared/components/section-header/SectionHeader';
import { pushDataLayer } from '@/src/shared/helpers/data-layer';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

import styles from './faq-section.module.css';
import { WHATSAPP_URL } from '@/src/config/site';

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

      {/* Always in the HTML (crawlers and AI search read every answer); only
          the height animates. Closed panels are inert for keyboard/AT users. */}
      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={styles.panel}
        initial={false}
        animate={
          reduce
            ? { opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }
            : { height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }
        }
        transition={{
          height: { duration: reduce ? 0 : DURATION.fast, ease: EASE },
          opacity: { duration: 0.2, ease: EASE },
        }}
      >
        <Text
          className={styles.answer}
          tag="p"
          variant="description_small"
          color="muted"
          noMotion
        >
          {answer}
        </Text>
      </motion.div>
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
        <SectionHeader
          className={styles.header}
          descriptionClassName={styles.headerDescription}
          eyebrow={t('faq.eyebrow')}
          title={t('faq.title')}
          description={t('faq.description')}
        />
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

        <div className={styles.footer}>
          <Text
            tag="p" 
            variant="description_small" 
            color="muted"
            delay={{ enter: 0, exit: 0 }}
          >
            {t('faq.stillHaveQuestion')}
          </Text>
          <Button
            text={t('faq.contactCta') as string}
            style="whatsapp"
            type="button"
            iconRight={ faWhatsapp }
            redirectTo={WHATSAPP_URL}
            onClick={() => pushDataLayer({ event: 'whatsapp_click' })}
          />
        </div>
      </Container>
    </div>
  );
};

export { FaqSection };
