import {
  faArrowRightArrowLeft,
  faBell,
  faBookOpen,
  faCalendarCheck,
  faCamera,
  faChartColumn,
  faChartLine,
  faChartPie,
  faCheckDouble,
  faClipboardCheck,
  faCodeCompare,
  faComments,
  faDiagramProject,
  faDisplay,
  faFileCircleCheck,
  faFileContract,
  faFileLines,
  faFilePen,
  faFolderTree,
  faGaugeHigh,
  faHandPointer,
  faHeadset,
  faInbox,
  faLanguage,
  faListCheck,
  faMagnifyingGlass,
  faMapLocationDot,
  faMasksTheater,
  faMicrophone,
  faPeopleGroup,
  faPhoneVolume,
  faQuoteRight,
  faRoute,
  faShieldHalved,
  faSignsPost,
  faSitemap,
  faSquarePollVertical,
  faStairs,
  faTableList,
  faTriangleExclamation,
  faUserGraduate,
  faWaveSquare,
} from "@fortawesome/free-solid-svg-icons";

import type { ProductEntry } from "@/src/features/products/types/product.types";

const img = (slug: string) => `/images/products/${slug}.webp`;

/** The 18 catalog products, in the brief's order (grouped by family). */
const productsStaticData: ProductEntry[] = [
  // Atención ciudadana
  {
    slug: "atencion-ciudadana-digital",
    category: "atencion-ciudadana",
    image: img("atencion-ciudadana-digital"),
    featureIcons: [faSignsPost, faBookOpen, faHeadset],
    related: ["telefonia-ia-bidireccional", "gestion-pqrsd", "totems-con-avatar"],
  },
  {
    slug: "telefonia-ia-bidireccional",
    category: "atencion-ciudadana",
    image: img("telefonia-ia-bidireccional"),
    featureIcons: [faPhoneVolume, faCalendarCheck, faArrowRightArrowLeft],
    related: ["atencion-ciudadana-digital", "gestion-pqrsd", "auditoria-de-atencion"],
  },
  {
    slug: "gestion-pqrsd",
    category: "atencion-ciudadana",
    image: img("gestion-pqrsd"),
    featureIcons: [faInbox, faSitemap, faBell],
    related: ["atencion-ciudadana-digital", "validacion-de-tramites", "auditoria-de-atencion"],
  },
  {
    slug: "totems-con-avatar",
    category: "atencion-ciudadana",
    image: img("totems-con-avatar"),
    featureIcons: [faDisplay, faRoute, faHandPointer],
    related: ["atencion-ciudadana-digital", "gestion-pqrsd", "analitica-de-espacios"],
  },
  {
    slug: "auditoria-de-atencion",
    category: "atencion-ciudadana",
    image: img("auditoria-de-atencion"),
    featureIcons: [faWaveSquare, faListCheck, faChartColumn],
    related: ["telefonia-ia-bidireccional", "atencion-ciudadana-digital", "simulacion-y-evaluacion"],
  },

  // Documentos, trámites y automatización
  {
    slug: "copiloto-para-funcionarios",
    category: "documentos-tramites",
    image: img("copiloto-para-funcionarios"),
    featureIcons: [faMagnifyingGlass, faQuoteRight, faFilePen],
    related: ["inteligencia-documental", "validacion-de-tramites", "automatizacion-institucional"],
  },
  {
    slug: "inteligencia-documental",
    category: "documentos-tramites",
    image: img("inteligencia-documental"),
    featureIcons: [faFolderTree, faCodeCompare, faFileCircleCheck],
    related: ["validacion-de-tramites", "copiloto-para-funcionarios", "asistente-de-contratacion-publica"],
  },
  {
    slug: "validacion-de-tramites",
    category: "documentos-tramites",
    image: img("validacion-de-tramites"),
    featureIcons: [faFileLines, faClipboardCheck, faTriangleExclamation],
    related: ["inteligencia-documental", "gestion-pqrsd", "automatizacion-institucional"],
  },
  {
    slug: "automatizacion-institucional",
    category: "documentos-tramites",
    image: img("automatizacion-institucional"),
    featureIcons: [faDiagramProject, faArrowRightArrowLeft, faShieldHalved],
    related: ["validacion-de-tramites", "inteligencia-documental", "copiloto-para-funcionarios"],
  },

  // Contratación e inversión pública
  {
    slug: "asistente-de-contratacion-publica",
    category: "contratacion-inversion",
    image: img("asistente-de-contratacion-publica"),
    featureIcons: [faFileContract, faCheckDouble, faTableList],
    related: ["supervision-contractual", "inteligencia-documental", "copiloto-para-funcionarios"],
  },
  {
    slug: "supervision-contractual",
    category: "contratacion-inversion",
    image: img("supervision-contractual"),
    featureIcons: [faListCheck, faBell, faClipboardCheck],
    related: ["asistente-de-contratacion-publica", "proyectos-e-inversion-publica", "inspeccion-y-asistencia-visual"],
  },
  {
    slug: "proyectos-e-inversion-publica",
    category: "contratacion-inversion",
    image: img("proyectos-e-inversion-publica"),
    featureIcons: [faFilePen, faMapLocationDot, faBookOpen],
    related: ["validacion-de-tramites", "supervision-contractual", "investigacion-y-consultas-publicas"],
  },

  // Investigación y participación
  {
    slug: "investigacion-y-consultas-publicas",
    category: "investigacion-participacion",
    image: img("investigacion-y-consultas-publicas"),
    featureIcons: [faMicrophone, faSquarePollVertical, faTableList],
    related: ["atencion-ciudadana-digital", "inteligencia-documental", "proyectos-e-inversion-publica"],
  },

  // Educación
  {
    slug: "formacion-institucional",
    category: "educacion",
    image: img("formacion-institucional"),
    featureIcons: [faStairs, faComments, faChartLine],
    related: ["simulacion-y-evaluacion", "ensenanza-de-idiomas", "copiloto-para-funcionarios"],
  },
  {
    slug: "simulacion-y-evaluacion",
    category: "educacion",
    image: img("simulacion-y-evaluacion"),
    featureIcons: [faMasksTheater, faListCheck, faUserGraduate],
    related: ["formacion-institucional", "auditoria-de-atencion", "ensenanza-de-idiomas"],
  },
  {
    slug: "ensenanza-de-idiomas",
    category: "educacion",
    image: img("ensenanza-de-idiomas"),
    featureIcons: [faLanguage, faStairs, faChartLine],
    related: ["formacion-institucional", "simulacion-y-evaluacion", "atencion-ciudadana-digital"],
  },

  // Visión computacional
  {
    slug: "analitica-de-espacios",
    category: "vision-computacional",
    image: img("analitica-de-espacios"),
    featureIcons: [faPeopleGroup, faChartPie, faGaugeHigh],
    related: ["totems-con-avatar", "inspeccion-y-asistencia-visual", "auditoria-de-atencion"],
  },
  {
    slug: "inspeccion-y-asistencia-visual",
    category: "vision-computacional",
    image: img("inspeccion-y-asistencia-visual"),
    featureIcons: [faCamera, faMagnifyingGlass, faFilePen],
    related: ["supervision-contractual", "inteligencia-documental", "analitica-de-espacios"],
  },
];

const getProductSlugs = (): string[] => productsStaticData.map((p) => p.slug);

const getProductBySlug = (slug: string): ProductEntry | undefined =>
  productsStaticData.find((p) => p.slug === slug);

export { getProductBySlug, getProductSlugs, productsStaticData };
