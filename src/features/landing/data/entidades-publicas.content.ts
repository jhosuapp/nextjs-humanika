import {
  faCamera,
  faClipboardCheck,
  faComments,
  faFileContract,
  faFileLines,
  faGraduationCap,
  faPeopleGroup,
  faShieldHalved,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import type { LandingStaticData } from "@/src/features/landing/types/landing.types";

/** /entidades-publicas — hub for the public-sector audience. */
const entidadesPublicasStaticData: LandingStaticData = {
  namespace: "entidades-publicas",
  secondaryHref: "/productos",
  sections: [
    {
      id: "families",
      kind: "cards",
      icons: [faComments, faFileLines, faFileContract, faPeopleGroup, faGraduationCap, faCamera],
      links: [
        "/productos#atencion-ciudadana",
        "/productos#documentos-tramites",
        "/productos#contratacion-inversion",
        "/productos#investigacion-participacion",
        "/productos#educacion",
        "/productos#vision-computacional",
      ],
    },
    {
      id: "principles",
      kind: "cards",
      icons: [faShieldHalved, faUserCheck, faClipboardCheck, faWhatsapp],
    },
  ],
};

export { entidadesPublicasStaticData };
