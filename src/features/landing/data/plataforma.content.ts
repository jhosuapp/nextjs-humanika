import {
  faChartColumn,
  faClipboardCheck,
  faComments,
  faDiagramProject,
  faFileExport,
  faFolderTree,
  faKey,
  faRobot,
  faUserCheck,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";

import type { LandingStaticData } from "@/src/features/landing/types/landing.types";

/**
 * /plataforma — Humanika Core: what the platform includes, its channels,
 * integrations, models, governance and languages. Every capability listed in
 * the copy is backed by the platform (nextjs-humanika-core-frontend); keep it
 * that way when editing `public/locales/<locale>/plataforma.json`.
 */
const plataformaStaticData: LandingStaticData = {
  namespace: "plataforma",
  secondaryHref: "/productos",
  sections: [
    {
      id: "capabilities",
      kind: "cards",
      icons: [faRobot, faFolderTree, faDiagramProject, faComments, faChartColumn, faFileExport],
    },
    { id: "connections", kind: "groups", groups: 4 },
    {
      id: "governance",
      kind: "cards",
      icons: [faUserShield, faClipboardCheck, faUserCheck, faKey],
    },
    { id: "languages", kind: "groups", groups: 2 },
  ],
};

export { plataformaStaticData };
