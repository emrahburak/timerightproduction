import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

export default {
  // Sitenin sekmede görünecek ismi
  title: "Time Right Production",

  // Arama motorları için açıklama (opsiyonel ama önerilir)
  description:
    "Time Right Production - Profesyonel Prodüksiyon ve Medya Hizmetleri",

  extends: [vikeReact],
} satisfies Config;
