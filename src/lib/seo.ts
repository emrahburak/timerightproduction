export interface SeoConfig {
  title: string;
  description: string;
  keywords: string[];
}

export const seoConfig: Record<'tr' | 'en', SeoConfig> = {
  tr: {
    title: "Time Right Production | Sahne Sanatları, Eğitim & Prodüksiyon",
    description: "Time Right Production; oyunculuk eğitimi, tiyatro prodüksiyonları, belgesel ve tanıtım filmleri, festival organizasyonları ve menajerlik hizmetleri sunan yaratıcı bir yapım şirketidir. Zürich ve Rotterdam'da kamera önü oyunculuk kursları.",
    keywords: [
      "oyunculuk eğitimi",
      "tiyatro prodüksiyon",
      "belgesel film",
      "tanıtım filmi",
      "festival organizasyon",
      "diksiyon eğitimi",
      "kamera önü oyunculuk",
      "menajerlik",
      "Zürich oyunculuk kursu",
      "Rotterdam oyunculuk",
      "ritim atölyesi",
      "senaryo yazımı",
      "film müziği",
      "şirket içi motivasyon",
    ],
  },
  en: {
    title: "Time Right Production | Performing Arts, Education & Production",
    description: "Time Right Production is a creative production company offering acting education, theatre productions, documentary and promotional films, festival organization, and management services. On-camera acting courses in Zurich and Rotterdam.",
    keywords: [
      "acting education",
      "theatre production",
      "documentary film",
      "promotional film",
      "festival organization",
      "diction training",
      "on-camera acting",
      "management services",
      "Zurich acting course",
      "Rotterdam acting",
      "rhythm atelier",
      "screenwriting",
      "film scores",
      "corporate motivation",
    ],
  },
};
