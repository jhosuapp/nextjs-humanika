import type { JSX } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";

import type { ITranslations } from "@/src/shared/interfaces/i18n.interface";
import type { ProductEntry } from "@/src/features/products/types/product.types";
import { Container } from "@/src/features/home/components/container/Container";
import { FadeIn } from "@/src/shared/components/motion/FadeIn";
import { Parallax } from "@/src/shared/components/motion/Parallax";
import { revealDelay } from '@/src/shared/helpers/motion-variants';

import styles from "./product-use-case.module.css";

type ProductUseCaseProps = {
  t: ITranslations;
  entry: ProductEntry;
  id: string;
};

const ProductUseCase = ({ t, entry, id }: ProductUseCaseProps): JSX.Element => (
  <div className={styles.section}>
    <span className={styles.glow} aria-hidden="true" />
    <Container id={id} className={styles.container} padding="xl">
      <div className={styles.wrapper}>
        <FadeIn className={styles.media}>
          <div className={styles.frame}>
            <Parallax className={styles.parallax} offset={28}>
              <Image
                src={entry.image}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 60rem"
                className={styles.image}
              />
            </Parallax>
          </div>
        </FadeIn>

        <div className={styles.content}>
          <FadeIn>
            <p className={styles.eyebrow}>{t("ui.useCaseEyebrow") as string}</p>
          </FadeIn>
          <FadeIn delay={revealDelay(1)}>
            <h2 className={styles.title}>{t("ui.useCaseTitle") as string}</h2>
          </FadeIn>
          <FadeIn delay={revealDelay(2)}>
            <blockquote className={styles.quote}>
              <FontAwesomeIcon
                className={styles.quoteIcon}
                icon={faQuoteLeft}
                aria-hidden="true"
              />
              <p>{t(`items.${entry.slug}.useCase`) as string}</p>
            </blockquote>
          </FadeIn>
          <FadeIn delay={revealDelay(3)}>
            <span className={styles.note}>{t("ui.useCaseNote") as string}</span>
          </FadeIn>
        </div>
      </div>
    </Container>
  </div>
);

export { ProductUseCase };
