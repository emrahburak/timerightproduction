export interface AcademyProgram {
  id: number;
  title: string;
  titleEn: string;
  icon: string;
  courses: string[];
  coursesEn: string[];
}

export const academyPrograms: AcademyProgram[] = [
  {
    id: 1,
    title: "Oyunculuk",
    titleEn: "Acting",
    icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
    courses: [
      "Kamera Önü Oyunculuk",
      "Temel Oyunculuk",
      "Konservatuara Hazırlık",
      "Etkili Konuşma, Vurgulu Tonlama",
      "Diksiyon, Artikülasyon, Diyafram",
      "Ses ve Nefes Kullanımı",
      "Monolog Çalışmaları"
    ],
    coursesEn: [
      "On-Camera Acting",
      "Fundamentals of Acting",
      "Conservatory Preparation",
      "Effective Speech & Intonation",
      "Diction, Articulation, Diaphragm",
      "Voice & Breath Control",
      "Monologue Studies"
    ]
  },
  {
    id: 2,
    title: "Yazarlık",
    titleEn: "Writing",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    courses: [
      "Senaryo Yazım Teknikleri",
      "Belgesel Yazım Teknikleri"
    ],
    coursesEn: [
      "Screenwriting Techniques",
      "Documentary Writing Techniques"
    ]
  },
  {
    id: 3,
    title: "Ritim Atölyesi",
    titleEn: "Rhythm Atelier",
    icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
    courses: [
      "Beden Perküsyonu",
      "Ritmik Motivasyon",
      "Ritim Enstrumanları"
    ],
    coursesEn: [
      "Body Percussion",
      "Rhythmic Motivation",
      "Rhythm Instruments"
    ]
  }
];
