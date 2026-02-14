export interface Instructor {
  id: number;
  fullname: string;
  role: 'Yönetmen-Senarist' | 'Yönetmen' | 'Oyuncu' | 'Oyuncu-Acting Coach' | 'Cast Directörü-Menajer' | 'Yönetmen-Akademisyen' | 'Baterist-Perküsyonist';
  description: string;
  image: string;
}
