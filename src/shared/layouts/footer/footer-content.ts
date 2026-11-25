import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faGithub,
  faLinkedinIn,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";

type FooterLinkStatic = {
  key: string;
  href: string;
  external?: boolean;
};

type FooterColumnStatic = {
  key: string;
  links: ReadonlyArray<FooterLinkStatic>;
};

type FooterSocialStatic = {
  key: string;
  name: string;
  href: string;
  icon: IconDefinition;
};

type FooterLegalStatic = {
  key: string;
  href: string;
};

type FooterStaticData = {
  brand: { name: string; mark: string };
  nav: { columns: ReadonlyArray<FooterColumnStatic> };
  bottom: {
    socials: ReadonlyArray<FooterSocialStatic>;
    legalLinks: ReadonlyArray<FooterLegalStatic>;
  };
};

const footerStaticData: FooterStaticData = {
  brand: { name: "150%", mark: "L" },
  nav: {
    columns: [
      {
        key: "explore",
        links: [
          { key: "bot", href: "/" },
          { key: "solutions", href: "/#solutions" },
          { key: "process", href: "/#process" },
          { key: "faqs", href: "/#faqs" },
        ],
      },
      {
        // Crawlable links to the catalog and every product family.
        key: "products",
        links: [
          { key: "catalog", href: "/productos" },
          { key: "atencionCiudadana", href: "/productos#atencion-ciudadana" },
          { key: "documentosTramites", href: "/productos#documentos-tramites" },
          { key: "contratacionInversion", href: "/productos#contratacion-inversion" },
          { key: "investigacionParticipacion", href: "/productos#investigacion-participacion" },
          { key: "educacion", href: "/productos#educacion" },
          { key: "visionComputacional", href: "/productos#vision-computacional" },
        ],
      },
      {
        key: "resources",
        links: [
          { key: "caseStudies", href: "/casos-de-exito" },
          { key: "articles", href: "/blog" },
          { key: "agentesIa", href: "/blog/agentes-ia-empresas" },
        ],
      },
      {
        key: "company",
        links: [
          {
            key: "digitalTransformation",
            href: "https://150porciento.com/digital-transformation/",
            external: true,
          },
          {
            key: "services",
            href: "https://150porciento.com/digital-agency-services/",
            external: true,
          },
          {
            key: "blog",
            href: "https://150porciento.com/blog",
            external: true,
          },
          {
            key: "contact",
            href: "https://150porciento.com/contact-us/",
            external: true,
          },
        ],
      },
    ],
  },
  bottom: {
    socials: [
      {
        key: "linkedin",
        name: "LinkedIn",
        href: "https://www.linkedin.com/showcase/inteligencia-artificial-empresas-150/",
        icon: faLinkedinIn,
      },
    ],
    legalLinks: [
      { key: "privacy", href: "/privacy" },
      { key: "terms", href: "/terms" },
    ],
  },
};

export { footerStaticData };
export type {
  FooterStaticData,
  FooterLinkStatic,
  FooterColumnStatic,
  FooterSocialStatic,
  FooterLegalStatic,
};
