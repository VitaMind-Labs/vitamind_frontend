"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DiseaseType, diseaseDefinitions } from "@/lib/diseases";
import { getDisease, setDisease as persistDisease } from "@/lib/storage";

const DEFAULT_DISEASE: DiseaseType = "ADHD";

import type { DiseaseDefinition } from "@/lib/diseases";

type DiseaseContextValue = {
  disease: DiseaseType;
  definition: DiseaseDefinition;
  theme: DiseaseDefinition["theme"];
  setDisease: (next: DiseaseType) => void;
};

const DiseaseContext = createContext<DiseaseContextValue | null>(null);

function resolveInitialDisease(): DiseaseType {
  if (typeof window === "undefined") return DEFAULT_DISEASE;
  const stored = getDisease();
  return stored && stored in diseaseDefinitions ? stored : DEFAULT_DISEASE;
}

export function DiseaseProvider({ children }: { children: React.ReactNode }) {
  const [disease, setDiseaseState] = useState<DiseaseType>(resolveInitialDisease);

  useEffect(() => {
    persistDisease(disease);
  }, [disease]);

  const value = useMemo(
    () => ({
      disease,
      definition: diseaseDefinitions[disease],
      theme: diseaseDefinitions[disease].theme,
      setDisease: setDiseaseState,
    }),
    [disease],
  );

  return <DiseaseContext.Provider value={value}>{children}</DiseaseContext.Provider>;
}

export function useDisease() {
  const context = useContext(DiseaseContext);
  if (!context) {
    throw new Error("useDisease must be used within a DiseaseProvider");
  }
  return context;
}
