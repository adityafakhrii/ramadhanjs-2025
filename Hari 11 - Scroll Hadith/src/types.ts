export interface Hadith {
  number: number;
  arab: string;
  id: string;
  narrator: string;
  sanad: string;
}

export interface HadithResponse {
  items: Hadith[];
  isNext: boolean;
  currentPage: number;
}