import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import {
  LANGUAGES,
  LanguageCode,
  changeLanguage as changeI18nLanguage,
} from "../config/i18n";

export type ContentLanguageCode = LanguageCode;
export type InterfaceLanguageCode = LanguageCode;

interface LanguageContextType {
  // Interface language (UI language)
  interfaceLanguage: InterfaceLanguageCode;
  setInterfaceLanguage: (language: InterfaceLanguageCode) => Promise<void>;

  // Content language (learning content language)
  contentLanguage: ContentLanguageCode;
  setContentLanguage: (language: ContentLanguageCode) => Promise<void>;

  // Available languages
  availableLanguages: typeof LANGUAGES;

  // Helper methods
  getLanguageInfo: (
    code: LanguageCode
  ) => (typeof LANGUAGES)[number] | undefined;
  isRTL: (code: LanguageCode) => boolean;
}

const INTERFACE_LANGUAGE_KEY = "@app_interface_language";
const CONTENT_LANGUAGE_KEY = "@app_content_language";

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [interfaceLanguage, setInterfaceLanguageState] =
    useState<InterfaceLanguageCode>("en");
  const [contentLanguage, setContentLanguageState] =
    useState<ContentLanguageCode>("en");
  const [isReady, setIsReady] = useState(false);

  // Load saved languages on mount
  useEffect(() => {
    loadSavedLanguages();
  }, []);

  const loadSavedLanguages = async () => {
    try {
      const [savedInterface, savedContent] = await Promise.all([
        AsyncStorage.getItem(INTERFACE_LANGUAGE_KEY),
        AsyncStorage.getItem(CONTENT_LANGUAGE_KEY),
      ]);

      if (savedInterface && isValidLanguageCode(savedInterface)) {
        setInterfaceLanguageState(savedInterface as InterfaceLanguageCode);
        await changeI18nLanguage(savedInterface as InterfaceLanguageCode);
      } else {
        // Use current i18n language
        setInterfaceLanguageState(i18n.language as InterfaceLanguageCode);
      }

      if (savedContent && isValidLanguageCode(savedContent)) {
        setContentLanguageState(savedContent as ContentLanguageCode);
      } else {
        // Default content language to interface language
        setContentLanguageState(
          (savedInterface as ContentLanguageCode) || "en"
        );
      }
    } catch (error) {
      console.error("Error loading saved languages:", error);
    } finally {
      setIsReady(true);
    }
  };

  const isValidLanguageCode = (code: string): boolean => {
    return LANGUAGES.some((lang) => lang.code === code);
  };

  const setInterfaceLanguage = async (language: InterfaceLanguageCode) => {
    try {
      setInterfaceLanguageState(language);
      await changeI18nLanguage(language);
      await AsyncStorage.setItem(INTERFACE_LANGUAGE_KEY, language);
    } catch (error) {
      console.error("Error setting interface language:", error);
    }
  };

  const setContentLanguage = async (language: ContentLanguageCode) => {
    try {
      setContentLanguageState(language);
      await AsyncStorage.setItem(CONTENT_LANGUAGE_KEY, language);
    } catch (error) {
      console.error("Error setting content language:", error);
    }
  };

  const getLanguageInfo = (code: LanguageCode) => {
    return LANGUAGES.find((lang) => lang.code === code);
  };

  const isRTL = (code: LanguageCode) => {
    const langInfo = getLanguageInfo(code);
    return langInfo?.rtl || false;
  };

  const value: LanguageContextType = useMemo(
    () => ({
      interfaceLanguage,
      setInterfaceLanguage,
      contentLanguage,
      setContentLanguage,
      availableLanguages: LANGUAGES,
      getLanguageInfo,
      isRTL,
    }),
    [interfaceLanguage, contentLanguage]
  );

  if (!isReady) {
    return null;
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for getting localized content
export const useLocalizedContent = <T extends Record<string, any>>(
  content: Record<LanguageCode, T>
): T => {
  const { contentLanguage } = useLanguage();
  return content[contentLanguage] || content.en;
};

// Helper function to format numbers based on locale
export const formatNumber = (
  number: number,
  language: LanguageCode,
  options?: Intl.NumberFormatOptions
): string => {
  const localeMap: Record<LanguageCode, string> = {
    en: "en-US",
    ru: "ru-RU",
    kk: "kk-KZ",
    ky: "ky-KG",
    uz: "uz-UZ",
  };

  return new Intl.NumberFormat(localeMap[language] || "en-US", options).format(
    number
  );
};

// Helper function to format dates based on locale
export const formatDate = (
  date: Date,
  language: LanguageCode,
  options?: Intl.DateTimeFormatOptions
): string => {
  const localeMap: Record<LanguageCode, string> = {
    en: "en-US",
    ru: "ru-RU",
    kk: "kk-KZ",
    ky: "ky-KG",
    uz: "uz-UZ",
  };

  return new Intl.DateTimeFormat(
    localeMap[language] || "en-US",
    options
  ).format(date);
};
