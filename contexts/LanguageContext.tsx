"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { copy, getDirection, type Lang } from "@/lib/i18n";

type LanguageContextValue = {
  language: Lang;
  setLanguage: (language: Lang) => void;
  direction: "ltr" | "rtl";
  dictionary: (typeof copy)[Lang];
};

const STORAGE_KEY = "vitamind-language";

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Lang>("en");

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (storedLanguage && copy[storedLanguage] && storedLanguage !== language) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    setLanguage,
    direction: getDirection(language),
    dictionary: copy[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
