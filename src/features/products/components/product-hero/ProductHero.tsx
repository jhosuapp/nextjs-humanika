import type { JSX, MouseEvent } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

import type { ITranslations } from "@/src/shared/interfaces/i18n.interface";
import type { ProductEntry } from "@/src/features/products/types/product.types";
import { Container } from "@/src/features/home/components/container/Container";
import { Button } from "@/src/shared/components/button/Button";
import { useLenisStore } from "@/src/shared/stores/lenis.store";
import { fadeUpMotion } from "@/src/shared/motion/fadeUp.motion";
import { zoomInMotion } from "@/src/shared/motion/zoomIn.motion";
import { pushDataLayer } from "@/src/shared/helpers/data-layer";
import { CustomLink } from "@/src/shared/components/custom-link/CustomLink";

import styles from "./product-hero.module.css";

type ProductHeroProps = {
  t: ITranslations;
  entry: ProductEntry;
  /** Product name without the "Humanika –" prefix. */
  name: string;
  demoUrl: string;
  useCaseId: string;
};

// Same choreography as the home hero: enter cascades top→bottom right after
// the PageTransition curtain (~0.52s); exit cascades bottom→top (lower blocks
// leave first, the eyebrow/visual last) using the shared fadeUp spring.
const MOTION = {
  category: fadeUpMotion(0.52, 0.15),
  title: fadeUpMotion(0.53, 0.14),
  description: fadeUpMotion(0.55, 0.13),
  actions: fadeUpMotion(0.57, 0.12),
  media: fadeUpMotion(0.54, 0.15),
  badge: zoomInMotion(0.9, 0.11),
};

const ProductHero = ({
  t,
  entry,
  name,
  demoUrl,
  useCaseId,
}: ProductHeroProps): JSX.Element => {
  const reduce = useReducedMotion();
  const lenis = useLenisStore((state) => state.lenis);
  const category = t(`categories.${entry.category}`) as string;

  // In-page jump: CustomLink treats "#id" as a home anchor, so scroll here.
  const handleUseCaseClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!lenis) return;
    event.preventDefault();
    lenis.scrollTo(`#${useCaseId}`, { duration: 1.1, offset: -80 });
  };

  return (
    <section className={styles.hero}>
      <div className={styles.orbs} aria-hidden="true">
        <motion.span
          className={`${styles.orb} ${styles.orbCyan}`}
          animate={reduce ? undefined : { x: [0, 24, 0], y: [0, -16, 0] }}
          transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.span
          className={`${styles.orb} ${styles.orbTeal}`}
          animate={reduce ? undefined : { x: [0, -28, 0], y: [0, 20, 0] }}
          transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
        />
      </div>

      {/* Layout lives on an inner div: classes merged onto Container's own
          `.container` (flex) would depend on CSS load order between routes. */}
      <Container className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.content}>
            {/* Category links to its family in the catalog (brief). */}
            <motion.div className={styles.categoryWrap} {...MOTION.category}>
              <CustomLink
                to={`/productos#${entry.category}`}
                className={styles.category}
                ariaLabel={t("ui.categoryLinkAria", { category }) as string}
              >
                <span className="gl-dot" aria-hidden="true" />
                {category}
              </CustomLink>
            </motion.div>

            <motion.h1 className={styles.title} {...MOTION.title}>
              <span className={`${styles.brand} gl-degradete-text`}>
                Humanika –{" "}
              </span>
              {name}
            </motion.h1>

            <motion.p className={styles.description} {...MOTION.description}>
              {t(`items.${entry.slug}.description`) as string}
            </motion.p>

            <motion.div className={styles.actions} {...MOTION.actions}>
              <Button
                text={t("ui.demoCta") as string}
                style="primary"
                type="button"
                iconRight={faWhatsapp}
                redirectTo={demoUrl}
                onClick={() =>
                  pushDataLayer({
                    event: "demo_request_click",
                    product: entry.slug,
                  })
                }
              />
              <a
                href={`#${useCaseId}`}
                className={styles.secondaryLink}
                onClick={handleUseCaseClick}
              >
                {t("ui.useCaseCta") as string}
                <FontAwesomeIcon icon={faArrowDown} aria-hidden="true" />
              </a>
            </motion.div>
          </div>

          <motion.figure className={styles.media} {...MOTION.media}>
            <div className={styles.frame}>
              <Image
                src={entry.image}
                alt={t(`items.${entry.slug}.imageAlt`) as string}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 46rem"
                className={styles.image}
              />
              <span className={styles.overlay} aria-hidden="true" />
            </div>

            <motion.figcaption className={styles.badge} {...MOTION.badge}>
              <span className={styles.badgeIcon} aria-hidden="true">
                <span className="gl-dot" />
              </span>
              <span className={styles.badgeText}>
                <strong>{t("ui.agentBadge") as string}</strong>
                <span>{category}</span>
              </span>
            </motion.figcaption>
          </motion.figure>
        </div>
      </Container>
    </section>
  );
};

export { ProductHero };
