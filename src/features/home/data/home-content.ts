import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBolt,
  faBrain,
  faBuilding,
  faCalendarCheck,
  faCartShopping,
  faChartLine,
  faCommentDots,
  faGear,
  faGraduationCap,
  faHeadset,
  faHeartPulse,
  faLayerGroup,
  faMicrophone,
  faPalette,
  faPowerOff,
  faRobot,
  faVideo,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

type LogoItem = {
  name: string;
  src: string;
};

type TrustedByLogoItem = {
  name: string;
  src: string;
};

type AudienceTabStatic = {
  key: "training" | "knowledge" | "service" | "sales" | "operations";
  image: string;
};

type ProcessStepStatic = {
  id: "design" | "train" | "integrate" | "operate";
  icon: IconDefinition;
};

type FloatIconStatic = {
  id: string;
  icon: IconDefinition;
  side: "left" | "right";
  topPercent: number;
  offset: number;
  size: number;
  rotate?: number;
  accent?: boolean;
};

type FaqItemStatic = {
  id: string;
};

type StatItemStatic = {
  id: "experience" | "interactions" | "industries";
  icon: IconDefinition;
  /** Target value for the count-up animation. */
  to: number;
  decimals?: number;
};

type CaseStudyStatic = {
  id: "mass-consumption" | "education" | "health" | "real-estate";
  icon: IconDefinition;
  logo?: string;
  /** When present, the metric animates as a count-up; otherwise the static
   *  i18n `metric` string is shown (e.g. "24/7"). */
  count?: { to: number; decimals?: number };
};

type PricingFeatureStatic = {
  id: "hosting" | "ai" | "support";
};

type HomeStaticData = {
  hero: {
    primaryCta: { href: string };
    secondaryCta: { href: string };
  };
  trustedBy: {
    rows: ReadonlyArray<ReadonlyArray<TrustedByLogoItem>>;
  };
  agentic: {
    icon: IconDefinition;
    cta: { href: string };
  };
  realtime: {
    cta: { href: string };
  };
  audience: {
    tabs: ReadonlyArray<AudienceTabStatic>;
  };
  process: {
    steps: ReadonlyArray<ProcessStepStatic>;
    floatIcons: ReadonlyArray<FloatIconStatic>;
  };
  integrations: {
    cta: { href: string };
    logos: ReadonlyArray<LogoItem>;
  };
  stats: {
    items: ReadonlyArray<StatItemStatic>;
  };
  caseStudies: {
    items: ReadonlyArray<CaseStudyStatic>;
  };
  pricing: {
    features: ReadonlyArray<PricingFeatureStatic>;
    cta: { href: string };
  };
  faq: {
    items: ReadonlyArray<FaqItemStatic>;
    contactCta: { href: string };
  };
};

const homeStaticData: HomeStaticData = {
  hero: {
    primaryCta: { href: "/bot" },
    secondaryCta: { href: "#demo" },
  },
  trustedBy: {
    rows: [
      [
        { name: "Corona", src: "/logos/corona.png" },
        { name: "Budweiser", src: "/logos/budweiser.png" },
        { name: "Michelob", src: "/logos/michelob.png" },
        { name: "Poker", src: "/logos/poker.png" },
        { name: "Pepsi", src: "/logos/pepsi.png" },
        { name: "Doritos", src: "/logos/doritos.png" },
        { name: "Detodito", src: "/logos/detodito.png" },
        { name: "Bon Yurt", src: "/logos/bon-yurt.png" },
        { name: "Alpina", src: "/logos/alpina.png" },
        { name: "Intel", src: "/logos/intel.png" },
        { name: "Monster", src: "/logos/monster.png" },
        { name: "Airtm", src: "/logos/airtm.png" },
        { name: "Primax", src: "/logos/primax.png" },
        { name: "Mass", src: "/logos/mass.png" },
        { name: "Listo", src: "/logos/listo.png" },
        { name: "Ogilvy", src: "/logos/ogilfy.png" },
      ],
      [
        { name: "Doyle", src: "/logos/doyle.png" },
        { name: "JBalvin", src: "/logos/jbalvin.png" },
        { name: "2 Night", src: "/logos/2-night.png" },
        { name: "Trece", src: "/logos/trece.png" },
        { name: "TIC", src: "/logos/tic.png" },
        { name: "Misiedo", src: "/logos/misiedo.png" },
        { name: "Ideam", src: "/logos/ideam.png" },
        { name: "Accion", src: "/logos/accion.png" },
        { name: "Fundacion", src: "/logos/fundacion.png" },
        { name: "Noewich", src: "/logos/noewich.png" },
        { name: "Earlham", src: "/logos/earlham.png" },
      ],
    ],
  },
  agentic: {
    icon: faVideo,
    cta: { href: "#agentic" },
  },
  realtime: {
    cta: { href: "#v4" },
  },
  audience: {
    tabs: [
      { key: "training", image: "/images/formacion-empresarial.jpg" },
      { key: "knowledge", image: "/images/contociento-organizacional.jpg" },
      { key: "service", image: "/images/servicio-y-soporte.jpg" },
      { key: "sales", image: "/images/ventas-y-crecimiento.jpg" },
      { key: "operations", image: "/images/productividad-y-opetaciones.jpg" },
    ],
  },
  process: {
    steps: [
      { id: "design", icon: faPalette },
      { id: "train", icon: faBrain },
      { id: "integrate", icon: faBolt },
      { id: "operate", icon: faGear },
    ],
    floatIcons: [
      {
        id: "robot",
        icon: faRobot,
        side: "left",
        topPercent: 12,
        offset: 140,
        size: 44,
        rotate: -8,
      },
      {
        id: "commentDots",
        icon: faCommentDots,
        side: "left",
        topPercent: 46,
        offset: 95,
        size: 32,
        rotate: 6,
        accent: true,
      },
      {
        id: "microphone",
        icon: faMicrophone,
        side: "left",
        topPercent: 82,
        offset: 120,
        size: 36,
        rotate: -4,
      },
      {
        id: "wand",
        icon: faWandMagicSparkles,
        side: "right",
        topPercent: 16,
        offset: 110,
        size: 36,
        rotate: 9,
        accent: true,
      },
      {
        id: "chart",
        icon: faChartLine,
        side: "right",
        topPercent: 50,
        offset: 130,
        size: 40,
        rotate: -6,
      },
      {
        id: "headset",
        icon: faHeadset,
        side: "right",
        topPercent: 84,
        offset: 85,
        size: 34,
        rotate: 4,
      },
    ],
  },
  integrations: {
    cta: { href: "#integrations" },
    logos: [
      { name: "Microsoft Teams", src: "/logos/integrations/microsoft-teams.svg" },
      { name: "WhatsApp", src: "/logos/integrations/whatsapp.svg" },
      { name: "Salesforce", src: "/logos/integrations/salesforce.svg" },
      { name: "HubSpot", src: "/logos/integrations/hubspot.svg" },
      { name: "SharePoint", src: "/logos/integrations/sharepoint.svg" },
      { name: "Google Workspace", src: "/logos/integrations/google-workspace.svg" },
      { name: "SAP", src: "/logos/integrations/sap.svg" },
      { name: "Microsoft Dynamics", src: "/logos/integrations/dynamics-365.svg" },
      { name: "Zendesk", src: "/logos/integrations/zendesk.svg" },
      { name: "ServiceNow", src: "/logos/integrations/servicenow.svg" },
      { name: "Moodle", src: "/logos/integrations/moodle.svg" },
      { name: "Amazon Web Services", src: "/logos/integrations/aws.svg" },
      { name: "Shopify", src: "/logos/integrations/shopify.svg" },
      { name: "Github", src: "/logos/integrations/github.svg" },
    ],
  },
  stats: {
    items: [
      { id: "experience", icon: faCalendarCheck, to: 10 },
      { id: "interactions", icon: faCommentDots, to: 5 },
      { id: "industries", icon: faLayerGroup, to: 4 },
    ],
  },
  caseStudies: {
    items: [
      { id: "mass-consumption", icon: faCartShopping, count: { to: 1 } },
      { id: "education", icon: faGraduationCap },
      { id: "health", icon: faHeartPulse, count: { to: 40 } },
      { id: "real-estate", icon: faBuilding, count: { to: 30 } },
    ],
  },
  pricing: {
    features: [{ id: "hosting" }, { id: "ai" }, { id: "support" }],
    cta: { href: "#contact" },
  },
  faq: {
    items: [
      { id: "digital-worker" },
      { id: "implementation-time" },
      { id: "replaces-people" },
      { id: "integrations" },
      { id: "documents" },
      { id: "engagement-model" },
      { id: "vs-tools" },
    ],
    contactCta: { href: "#contact" },
  },
};

export { homeStaticData };
export type {
  HomeStaticData,
  LogoItem,
  AudienceTabStatic,
  FaqItemStatic,
  PricingFeatureStatic,
  ProcessStepStatic,
  FloatIconStatic,
  StatItemStatic,
  CaseStudyStatic,
};
