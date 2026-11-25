import {
  faBookOpen,
  faChartColumn,
  faGears,
  faGraduationCap,
  faHandshake,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";

import type { LandingStaticData } from "@/src/features/landing/types/landing.types";

/** /empresas — hub for the private-company audience. */
const empresasStaticData: LandingStaticData = {
  namespace: "empresas",
  secondaryHref: "/plataforma",
  sections: [
    {
      id: "areas",
      kind: "cards",
      icons: [faGraduationCap, faBookOpen, faHeadset, faHandshake, faGears, faChartColumn],
      links: [
        "/productos/formacion-institucional",
        null,
        null,
        null,
        "/productos/automatizacion-institucional",
        null,
      ],
    },
    { id: "connections", kind: "groups", groups: 2 },
  ],
};

export { empresasStaticData };
