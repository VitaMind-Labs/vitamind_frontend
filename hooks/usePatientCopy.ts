"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { patientCopy } from "@/lib/i18n/patient";

/** The patient app's copy in the visitor's language (EN/AR). */
export function usePatientCopy() {
  const { language } = useLanguage();
  return patientCopy[language];
}
