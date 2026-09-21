'use client';

import { useState } from 'react';
import { diseaseDefinitions, DiseaseType } from '@/lib/diseases';
import { DiseaseCard } from './_components/disease-card';
import { BookOpen, Shield, Sparkles, Heart, Brain, Moon, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '../home/_components';

const STATS = [
  { value: "3+", label: "Conditions Supported" },
  { value: "100%", label: "Evidence-Based" },
  { value: "24/7", label: "Clinical Access" },
  { value: "∞", label: "Compassionate Care" },
];

const TRUST = [
  { icon: Shield, label: "Clinically Verified" },
  { icon: Sparkles, label: "Evidence-Based" },
  { icon: Heart, label: "Patient-Centered" },
];

// Mapping des icônes pour les onglets
const TAB_ICONS: Record<DiseaseType, typeof Brain> = {
  ADHD: Brain,
  BIPOLAR: Moon,
  SCHIZOPHRENIA: Activity,
};

// Configuration des onglets
const TABS_CONFIG = [
  { id: 'ADHD' as const, label: 'ADHD', icon: Brain, color: '#518591' },
  { id: 'BIPOLAR' as const, label: 'Bipolar', icon: Moon, color: '#e3b01c' },
  { id: 'SCHIZOPHRENIA' as const, label: 'Schizophrenia', icon: Activity, color: '#518591' },
];

export default function ClinicalGuidePage() {
  const [activeTab, setActiveTab] = useState<DiseaseType>('ADHD');

  return (
    <div className="min-h-screen" style={{ background: "#F7F5F0" }}>
<Header />
      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-28 md:py-36 px-6 md:px-10 lg:px-16">
        {/* Halos */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-0 h-[500px] w-[500px] rounded-full blur-[140px]" style={{ background: "rgba(81,133,145,0.08)" }} />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full blur-[120px]" style={{ background: "rgba(227,176,28,0.06)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 mb-8"
              style={{ background: "rgba(255,255,255,0.80)", border: "1px solid rgba(81,133,145,0.14)", backdropFilter: "blur(12px)" }}>
              <BookOpen className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#518591" }} />
              <span className="font-body text-[12px] font-semibold uppercase tracking-[0.24em]" style={{ color: "#518591" }}>
                Evidence-Based Clinical Resource
              </span>
            </div>

            {/* Titre */}
            <h1 className="font-display font-light tracking-[-0.03em]" style={{ fontSize: "clamp(42px, 6vw, 80px)", lineHeight: 1.02, color: "#0f172a" }}>
              Clinical{" "}
              <span style={{ backgroundImage: "linear-gradient(135deg, #518591, #2c3e3b, #e3b01c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Guide
              </span>
            </h1>

            {/* Ligne déco */}
            <motion.div initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 0.6, duration: 0.9, ease: "easeInOut" }}
              className="mt-6 mb-7 h-[2px] rounded-full" style={{ background: "linear-gradient(to right, #518591, #e3b01c)" }} />

            <p className="font-body text-[17px] leading-[1.75] max-w-xl" style={{ color: "rgba(15,23,42,0.62)" }}>
              Comprehensive, evidence-based information about mental health conditions.
              Understanding is the first step toward healing and recovery.
            </p>

            {/* Trust items */}
            <div className="flex flex-wrap gap-6 mt-10">
              {TRUST.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 flex-shrink-0" style={{ color: "#518591" }} />
                  <span className="font-body text-[14px]" style={{ color: "rgba(44,62,59,0.65)" }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


      {/* ── TABS ET CARDS ── */}
      <section className="py-24 md:py-32 px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DiseaseType)} className="w-full">
            {/* Tab List personnalisée */}
            <div className="flex justify-center mb-16">
              <TabsList className="inline-flex gap-2 p-1.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.70)", border: "1px solid rgba(81,133,145,0.12)", backdropFilter: "blur(8px)" }}>
                {TABS_CONFIG.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const diseaseData = diseaseDefinitions[tab.id];

                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex items-center gap-2.5 px-6 py-3 rounded-xl transition-all duration-300 data-[state=active]:shadow-sm"
                      style={{
                        color: isActive ? diseaseData.theme.primary : "rgba(44,62,59,0.60)",
                        background: isActive ? "rgba(255,255,255,0.90)" : "transparent",
                        border: isActive ? `1px solid ${diseaseData.theme.primary}20` : "1px solid transparent",
                      }}
                    >
                      <Icon className="h-4.5 w-4.5" style={{ color: isActive ? diseaseData.theme.primary : "currentColor" }} />
                      <span className="font-body text-[14px] font-semibold">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Contenu des onglets avec animation */}
            <AnimatePresence mode="wait">
              {TABS_CONFIG.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <DiseaseCard
                      id={tab.id.toLowerCase()}
                      disease={diseaseDefinitions[tab.id]}
                      index={0}
                    />
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>

          {/* Indicateur de navigation */}
          <div className="flex justify-center gap-2 mt-12">
            {TABS_CONFIG.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: activeTab === tab.id ? "32px" : "8px",
                  height: "8px",
                  background: activeTab === tab.id
                    ? `linear-gradient(90deg, ${diseaseDefinitions[tab.id].theme.primary}, ${diseaseDefinitions[tab.id].theme.accent})`
                    : "rgba(81,133,145,0.25)",
                }}
              />
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}