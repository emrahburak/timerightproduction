export interface Instructor {
  id: string;
  fullname: string;
  image: string;
}

export const INSTRUCTORS_DATA: Instructor[] = [
  {
    id: "3",
    fullname: "İlker AKSUM",
    image: "timeright-instructor-ilker-aksum.webp",
  },
  {
    id: "4",
    fullname: "Hacı Mehmet DURANOĞLU",
    image: "timeright-instructor-haci-mehmet-duranoglu.webp",
  },
  {
    id: "9",
    fullname: "Cem Altun",
    image: "timeright-instructor-cem-altun.webp",
  },
  {
    id: "5",
    fullname: "Soydan SOYDAŞ",
    image: "timeright-instructor-soydan-soydas.webp",
  },
  {
    id: "6",
    fullname: "Zafer ALTUN",
    image: "timeright-instructor-zafer-altun.webp",
  },
  {
    id: "7",
    fullname: "Fatoş YILMAZ",
    image: "timeright-instructor-fatos-yilmaz.webp",
  },
  {
    id: "8",
    fullname: "Asef Okan YAĞCI",
    image: "timeright-instructor-asef-okan-yagci.webp",
  },
] as const;
