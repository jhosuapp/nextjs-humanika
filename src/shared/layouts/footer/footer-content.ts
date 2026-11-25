import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

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
    // Three short columns on one row: site pages, resources, parent company.
    columns: [
      {
        key: "explore",
        links: [
          { key: "bot", href: "/" },
          { key: "platform", href: "/plataforma" },
          { key: "business", href: "/empresas" },
          { key: "publicSector", href: "/entidades-publicas" },
          { key: "about", href: "/nosotros" },
        ],
      },
      {
        key: "resources",
        links: [
          { key: "caseStudies", href: "/casos-de-exito" },
          { key: "articles", href: "/blog" },
          { key: "faqs", href: "/#faqs" },
        ],
      },
      {
        key: "company",
        links: [
          { key: "site", href: "https://150porciento.com/", external: true },
          {
            key: "services",
            href: "https://150porciento.com/digital-agency-services/",
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
