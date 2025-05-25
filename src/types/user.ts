export interface UserProfile {
  uid: string;
  email: string;
  language: string;
  gender: "boy" | "girl";
  grade: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const AVAILABLE_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "ru", name: "Russian", nativeName: "русский", flag: "🇷🇺" },
  { code: "ky", name: "Kyrgyz", nativeName: "кыргыз", flag: "🇰🇬" },
  { code: "uz", name: "Uzbek", nativeName: "oʻzbek", flag: "🇺🇿" },
  { code: "kk", name: "Kazakh", nativeName: "қазақ", flag: "🇰🇿" },
];

export interface Gender {
  value: "boy" | "girl";
  emoji: string;
  label: string;
}

export const AVAILABLE_GENDERS: Gender[] = [
  { value: "boy", emoji: "🧑🏻‍🦱", label: "Boy" },
  { value: "girl", emoji: "👩🏻", label: "Girl" },
];

export const AVAILABLE_GRADES = [1, 2, 3, 4, 5, 6];
