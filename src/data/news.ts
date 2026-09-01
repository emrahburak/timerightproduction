export type NewsCategory =
  | 'theatre'
  | 'film'
  | 'academy'
  | 'event';

export type NewsMediaType =
  | 'article'
  | 'youtube'
  | 'photo';

export interface NewsSource {
  name: string;
  url: string;
}

export interface NewsItem {
  id: string;
  category: NewsCategory;
  type: NewsMediaType;
  image: string;
  images?: string[];
  url?: string;
  date?: string;
  youtubeId?: string;
  featured?: boolean;
  sources?: NewsSource[];
}

export const newsItems: NewsItem[] = [
  {
    id: 'askin-ozanlari-rotterdam',
    category: 'theatre',
    type: 'article',
    image: 'askin-ozanlari-stage-04.webp',
    images: [
      'askin-ozanlari-cast-01.webp',
      'askin-ozanlari-cast-02.webp',
      'askin-ozanlari-cast-03.webp',
      'askin-ozanlari-cast-04.webp',
      'askin-ozanlari-stage-01.webp',
      'askin-ozanlari-stage-02.webp',
      'askin-ozanlari-stage-03.webp',
      'askin-ozanlari-stage-05.webp',
      'askin-ozanlari-stage-06.webp',
      'askin-ozanlari-stage-07.webp',
      'askin-ozanlari-stage-08.webp',
      'askin-ozanlari-stage-09.webp',
    ],
    date: '2026-06',
    featured: true,
    sources: [
      {
        name: 'Radyo Deniz',
        url: 'https://radyodeniz.com/rotterdamda-askin-ozanlarina-buyuk-ilgi-salon-tiklim-tiklim-doldu-dakikalarca-ayakta-alkislandi/',
      },
      {
        name: "N'Haber",
        url: 'https://nhaber.nl/hollandada-biletleri-karaborsaya-dusen-askin-ozanlari-hakkinda/',
      },
      {
        name: 'Güncel Haber',
        url: 'https://guncelhaber.nl/sevda-kusun-kanadinda-rotterdamda-ozanlarin-izinde-bir-gun/',
      },
    ],
  },
];
