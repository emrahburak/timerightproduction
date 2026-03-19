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
    id: "5",
    fullname: "Soydan SOYDAŞ",
    fullname_en: "Soydan SOYDAS", // Optional for future use if names differ
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
    fullname_en: "Fatos YILMAZ",
    image: "timeright-instructor-fatos-yilmaz.webp",
  },
  {
    id: "8",
    fullname: "Asef Okan YAĞCI",
    fullname_en: "Asef Okan YAGCI",
    image: "timeright-instructor-asef-okan-yagci.webp",
  },
] as const;
