"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { LANGS, copy, getDirection, type Lang } from "@/lib/i18n";

type LanguageContextValue = {
  language: Lang;
  setLanguage: (language: Lang) => void;
  direction: "ltr" | "rtl";
  dictionary: (typeof copy)[Lang];
};

const STORAGE_KEY = "vitamind-language";
const DEFAULT_LANGUAGE: Lang = "en";

const LanguageContext = createContext<LanguageContextValue | null>(null);

function normalizeStoredLanguage(value: string | null): Lang {
  const storedLanguage = value === "ar" ? "derja" : value;
  return storedLanguage && storedLanguage in copy ? (storedLanguage as Lang) : DEFAULT_LANGUAGE;
}

function getLanguageSnapshot(): Lang {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  return normalizeStoredLanguage(window.localStorage.getItem(STORAGE_KEY));
}

function subscribeToLanguageChange(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("vitamind-language-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("vitamind-language-change", callback);
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribeToLanguageChange,
    getLanguageSnapshot,
    () => DEFAULT_LANGUAGE,
  );

  const setLanguage = useCallback((nextLanguage: Lang) => {
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    window.dispatchEvent(new Event("vitamind-language-change"));
  }, []);

  useEffect(() => {
    const selected = LANGS.find((item) => item.code === language);
    document.documentElement.lang = selected?.bcp47 ?? language;
    document.documentElement.dir = selected?.dir ?? "ltr";
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
