"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { LANGS, LANGUAGE_STORAGE_KEY, copy, getDirection, normalizeLanguage, type Lang } from "@/lib/i18n/config";

type LanguageContextValue = {
  language: Lang;
  setLanguage: (language: Lang) => void;
  direction: "ltr" | "rtl";
  dictionary: (typeof copy)[Lang];
};

const STORAGE_KEY = LANGUAGE_STORAGE_KEY;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLanguage(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeLanguageCookie(language: Lang) {
  document.cookie = `${STORAGE_KEY}=${language}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

function subscribeToLanguageChange(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("vitamind-language-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("vitamind-language-change", callback);
  };
}

export function LanguageProvider({ children, initialLanguage = "en" }: { children: ReactNode; initialLanguage?: Lang }) {
  // The server renders `initialLanguage` (from the cookie); the client keeps localStorage as its source of truth.
  const getSnapshot = useCallback(() => {
    const stored = readStoredLanguage();
    return stored === null ? initialLanguage : normalizeLanguage(stored);
  }, [initialLanguage]);

  const language = useSyncExternalStore(subscribeToLanguageChange, getSnapshot, () => initialLanguage);

  const setLanguage = useCallback((nextLanguage: Lang) => {
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    writeLanguageCookie(nextLanguage);
    window.dispatchEvent(new Event("vitamind-language-change"));
  }, []);

  useEffect(() => {
    const selected = LANGS.find((item) => item.code === language);
    document.documentElement.lang = selected?.bcp47 ?? language;
    document.documentElement.dir = selected?.dir ?? "ltr";
    // Keep the cookie aligned for visitors whose preference predates the cookie.
    if (language !== initialLanguage) writeLanguageCookie(language);
  }, [language, initialLanguage]);

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
