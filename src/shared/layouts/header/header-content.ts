type NavLinkStatic = {
  key: string;
  href: string;
  external?: boolean;
  children?: ReadonlyArray<NavLinkStatic>;
};

type LanguageOption = {
  code: string;
  label: string;
  native: string;
};

type HeaderStaticData = {
  brand: { name: string; mark: string };
  nav: ReadonlyArray<NavLinkStatic>;
  primaryCta: { href: string };
  secondaryCta: { href: string };
  languages: ReadonlyArray<LanguageOption>;
};

const headerStaticData: HeaderStaticData = {
  brand: { name: "150%", mark: "L" },
  nav: [
    { key: "bot", href: "/#hero" },
    { key: "solutions", href: "/#solutions" },
    { key: "process", href: "/#process" },
    { key: "caseStudies", href: "/casos-de-exito" },
    { key: "faqs", href: "/#faqs" },
    {
      key: "articles",
      href: "/blog",
      children: [
        { key: "digitalCoworkers", href: "/blog/colaboradores-digitales" },
        { key: "trust", href: "/blog/crear-confianza" },
        { key: "fuerzaLaboral", href: "/blog/fuerza-laboral-hibrida" },
        { key: "allArticles", href: "/blog" },
      ],
    },
    { key: "about150", href: "https://150porciento.com/", external: true },
  ],
  primaryCta: { href: "#get-started" },
  secondaryCta: { href: "#signin" },
  languages: [
    // { code: "en", label: "EN", native: "English" },
    { code: "es", label: "ES", native: "Español" },
  ],
};

export { headerStaticData };
export type { HeaderStaticData, NavLinkStatic, LanguageOption };
