import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faBell,
  faBookOpen,
  faBuildingColumns,
  faBullseye,
  faCalendarCheck,
  faCamera,
  faChartColumn,
  faChartLine,
  faClipboardList,
  faClock,
  faCodeCompare,
  faCommentDots,
  faComments,
  faDiagramProject,
  faDisplay,
  faEnvelope,
  faFileContract,
  faFileImport,
  faFileLines,
  faFilePen,
  faFileSignature,
  faFlagCheckered,
  faFolderOpen,
  faFolderTree,
  faGaugeHigh,
  faGlobe,
  faGraduationCap,
  faHandPointer,
  faHeadset,
  faInbox,
  faLanguage,
  faLightbulb,
  faListCheck,
  faMapLocationDot,
  faMasksTheater,
  faMicrophone,
  faPeopleGroup,
  faPhone,
  faPhoneVolume,
  faQuoteRight,
  faRoute,
  faScaleBalanced,
  faServer,
  faSignsPost,
  faSitemap,
  faStairs,
  faTableList,
  faTriangleExclamation,
  faUserTie,
  faUsers,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import type {
  DemoNodeRef,
  ProductDemoConfig,
} from "@/src/features/products/types/product.types";

type Trio = [IconDefinition, IconDefinition, IconDefinition];
type Index = 0 | 1 | 2;
/** Visible chat/log lines once each of the 4 steps has played. */
type Counts = [number, number, number, number];

const channel = (i: Index) => `channel-${i}` as DemoNodeRef;
const source = (i: Index) => `source-${i}` as DemoNodeRef;

type TemplateInput = {
  channels: Trio;
  sources: Trio;
  operator: IconDefinition;
  /** Channel node the story enters through. */
  from: Index;
  /** Source node the agent checks. */
  check: Index;
  messages: Counts;
};

/**
 * Conversational products: a person writes in → the agent checks approved
 * sources → answers through the same channel → a follow-up reaches the human
 * on the side (operator, reviewer, HR…).
 */
const conversation = ({
  channels,
  sources,
  operator,
  from,
  check,
  messages,
}: TemplateInput): ProductDemoConfig => ({
  channelIcons: channels,
  sourceIcons: sources,
  operatorIcon: operator,
  steps: [
    { route: [channel(from), "channels-hub", "agent"], focus: "channels", messages: messages[0] },
    { route: ["agent", "sources-hub", source(check), "sources-hub", "agent"], focus: "sources", messages: messages[1] },
    { route: ["agent", "channels-hub", channel(from)], focus: "agent", messages: messages[2] },
    { route: [channel(from), "channels-hub", "agent", "operator"], focus: "operator", messages: messages[3] },
  ],
});

/**
 * Analysis products: an input arrives → the agent cross-checks one source →
 * produces its result in another → hands it to the person in charge.
 */
const analysis = ({
  channels,
  sources,
  operator,
  from,
  check,
  output,
  messages,
}: TemplateInput & { output: Index }): ProductDemoConfig => ({
  channelIcons: channels,
  sourceIcons: sources,
  operatorIcon: operator,
  steps: [
    { route: [channel(from), "channels-hub", "agent"], focus: "channels", messages: messages[0] },
    { route: ["agent", "sources-hub", source(check), "sources-hub", "agent"], focus: "sources", messages: messages[1] },
    { route: ["agent", "sources-hub", source(output), "sources-hub", "agent"], focus: "sources", messages: messages[2] },
    { route: ["agent", "operator"], focus: "operator", messages: messages[3] },
  ],
});

/** 3D "how it works" demo per product slug. Copy: `items.<slug>.demo`. */
const productDemosStaticData: Record<string, ProductDemoConfig> = {
  // Atención ciudadana
  "atencion-ciudadana-digital": conversation({
    channels: [faGlobe, faWhatsapp, faCommentDots],
    sources: [faFileLines, faListCheck, faClock],
    operator: faUserTie,
    from: 1,
    check: 1,
    messages: [1, 2, 4, 7],
  }),
  "telefonia-ia-bidireccional": conversation({
    channels: [faPhoneVolume, faPhone, faBell],
    sources: [faCalendarCheck, faDiagramProject, faFolderOpen],
    operator: faHeadset,
    from: 1,
    check: 0,
    messages: [1, 2, 4, 7],
  }),
  "gestion-pqrsd": conversation({
    channels: [faGlobe, faEnvelope, faBuildingColumns],
    sources: [faInbox, faFolderTree, faBell],
    operator: faSitemap,
    from: 0,
    check: 0,
    messages: [1, 2, 4, 7],
  }),
  "totems-con-avatar": conversation({
    channels: [faMicrophone, faHandPointer, faFilePen],
    sources: [faListCheck, faRoute, faMapLocationDot],
    operator: faHeadset,
    from: 0,
    check: 1,
    messages: [1, 2, 4, 7],
  }),
  "auditoria-de-atencion": analysis({
    channels: [faPhoneVolume, faComments, faEnvelope],
    sources: [faBookOpen, faListCheck, faChartColumn],
    operator: faUserTie,
    from: 0,
    check: 0,
    output: 2,
    messages: [1, 2, 4, 6],
  }),

  // Documentos, trámites y automatización
  "copiloto-para-funcionarios": conversation({
    channels: [faComments, faGlobe, faEnvelope],
    sources: [faBookOpen, faDiagramProject, faScaleBalanced],
    operator: faUserTie,
    from: 0,
    check: 1,
    messages: [1, 2, 4, 7],
  }),
  "inteligencia-documental": analysis({
    channels: [faFileLines, faFilePen, faFileImport],
    sources: [faFolderTree, faTableList, faCodeCompare],
    operator: faUsers,
    from: 0,
    check: 0,
    output: 2,
    messages: [1, 3, 5, 6],
  }),
  "validacion-de-tramites": analysis({
    channels: [faGlobe, faBuildingColumns, faEnvelope],
    sources: [faListCheck, faFileLines, faTriangleExclamation],
    operator: faUserTie,
    from: 0,
    check: 0,
    output: 2,
    messages: [1, 2, 4, 5],
  }),
  "automatizacion-institucional": analysis({
    channels: [faInbox, faEnvelope, faFilePen],
    sources: [faServer, faDiagramProject, faClipboardList],
    operator: faUserTie,
    from: 0,
    check: 0,
    output: 2,
    messages: [1, 3, 5, 6],
  }),

  // Contratación e inversión pública
  "asistente-de-contratacion-publica": analysis({
    channels: [faFileContract, faFileLines, faFilePen],
    sources: [faListCheck, faFolderTree, faQuoteRight],
    operator: faUsers,
    from: 0,
    check: 0,
    output: 2,
    messages: [1, 3, 5, 6],
  }),
  "supervision-contractual": analysis({
    channels: [faFileSignature, faCamera, faFileLines],
    sources: [faListCheck, faFlagCheckered, faBell],
    operator: faUserTie,
    from: 1,
    check: 1,
    output: 2,
    messages: [1, 3, 4, 5],
  }),
  "proyectos-e-inversion-publica": analysis({
    channels: [faFileLines, faBookOpen, faFilePen],
    sources: [faBullseye, faCodeCompare, faLightbulb],
    operator: faUserTie,
    from: 0,
    check: 1,
    output: 0,
    messages: [1, 3, 4, 6],
  }),

  // Investigación y participación
  "investigacion-y-consultas-publicas": analysis({
    channels: [faMicrophone, faComments, faCommentDots],
    sources: [faFolderTree, faFileLines, faQuoteRight],
    operator: faUsers,
    from: 2,
    check: 0,
    output: 2,
    messages: [1, 3, 4, 6],
  }),

  // Educación
  "formacion-institucional": conversation({
    channels: [faComments, faMicrophone, faDisplay],
    sources: [faGraduationCap, faBookOpen, faChartLine],
    operator: faUsers,
    from: 0,
    check: 0,
    messages: [1, 2, 4, 7],
  }),
  "simulacion-y-evaluacion": conversation({
    channels: [faMicrophone, faComments, faMasksTheater],
    sources: [faListCheck, faBookOpen, faScaleBalanced],
    operator: faChartColumn,
    from: 0,
    check: 0,
    messages: [2, 3, 5, 6],
  }),
  "ensenanza-de-idiomas": conversation({
    channels: [faMicrophone, faComments, faSignsPost],
    sources: [faStairs, faLanguage, faListCheck],
    operator: faChartLine,
    from: 0,
    check: 0,
    messages: [1, 2, 4, 7],
  }),

  // Visión computacional
  "analitica-de-espacios": analysis({
    channels: [faVideo, faUsers, faPeopleGroup],
    sources: [faGaugeHigh, faChartLine, faClock],
    operator: faUserTie,
    from: 1,
    check: 0,
    output: 1,
    messages: [1, 2, 4, 5],
  }),
  "inspeccion-y-asistencia-visual": conversation({
    channels: [faCamera, faMicrophone, faComments],
    sources: [faFolderOpen, faTriangleExclamation, faFileSignature],
    operator: faUserTie,
    from: 0,
    check: 1,
    messages: [1, 2, 4, 7],
  }),
};

export { productDemosStaticData };
