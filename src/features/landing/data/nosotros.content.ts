import {
  faBullseye,
  faChartLine,
  faComments,
  faFolderTree,
  faGears,
  faLightbulb,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";

import type { LandingStaticData } from "@/src/features/landing/types/landing.types";

/** /nosotros — who Humanika is (an initiative of 150 Por Ciento) and how it works. */
const nosotrosStaticData: LandingStaticData = {
  namespace: "nosotros",
  secondaryHref: "/casos-de-exito",
  sections: [
    {
      id: "approach",
      kind: "cards",
      icons: [faLightbulb, faUserCheck, faChartLine],
    },
    {
      id: "method",
      kind: "cards",
      icons: [faBullseye, faFolderTree, faGears, faComments],
    },
  ],
};

export { nosotrosStaticData };
