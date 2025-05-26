import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

// Translation files should be imported as modules
import en from "./translations/en";
import ru from "./translations/ru";
import kk from "./translations/kk";
import ky from "./translations/ky";
import uz from "./translations/uz";

const LANGUAGE_STORAGE_KEY = "@app_language";

// Language detector
const languageDetector = {
  type: "languageDetector" as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      // First, try to get saved language
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }

      // Otherwise, use device language
      const deviceLanguage = Localization.locale.split("-")[0];
      const supportedLanguages = ["en", "ru", "kk", "ky", "uz"];

      if (supportedLanguages.includes(deviceLanguage)) {
        callback(deviceLanguage);
      } else {
        callback("en"); // Default to English
      }
    } catch (error) {
      console.error("Error detecting language:", error);
      callback("en");
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  },
};

// Initialize i18n
i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      kk: { translation: kk },
      ky: { translation: ky },
      uz: { translation: uz },
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

// Language configuration
export const LANGUAGES = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    rtl: false,
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    flag: "🇷🇺",
    rtl: false,
  },
  {
    code: "kk",
    name: "Kazakh",
    nativeName: "Қазақша",
    flag: "🇰🇿",
    rtl: false,
  },
  {
    code: "ky",
    name: "Kyrgyz",
    nativeName: "Кыргызча",
    flag: "🇰🇬",
    rtl: false,
  },
  {
    code: "uz",
    name: "Uzbek",
    nativeName: "O'zbekcha",
    flag: "🇺🇿",
    rtl: false,
  },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

// Helper function to get current language info
export const getCurrentLanguage = () => {
  const currentCode = i18n.language;
  return LANGUAGES.find((lang) => lang.code === currentCode) || LANGUAGES[0];
};

// Helper function to change language
export const changeLanguage = async (languageCode: LanguageCode) => {
  try {
    await i18n.changeLanguage(languageCode);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
  } catch (error) {
    console.error("Error changing language:", error);
  }
};
