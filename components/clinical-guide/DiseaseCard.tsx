'use client';

import React, { useState } from 'react';
import { Brain, Moon, Activity, ChevronDown, ChevronUp, TrendingUp, Pill, AlertCircle, GraduationCap } from 'lucide-react';
import { DiseaseDefinition } from '@/lib/diseases/data';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ─── ICÔNES ───────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = { Brain, Moon, Activity };

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface DiseaseCardProps { id: string; disease: DiseaseDefinition; index: number }

// ─── SOUS-COMPOSANTS ──────────────────────────────────────────────────────────
function SectionLabel({ color, children }: { color: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <span className="h-[2px] w-5 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color }}>{children}</span>
        </div>
    );
}

function SymbolList({ items, color }: { items: string[]; color: string }) {
    return (
        <ul className="space-y-2.5">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                    <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: color }} />
                    <span className="font-body text-[14px] leading-[1.65]" style={{ color: "rgba(15,23,42,0.65)" }}>{item}</span>
                </li>
            ))}
        </ul>
    );
}

function StatChip({ icon: Icon, label, value, iconColor }: { icon: React.ElementType; label: string; value: string; iconColor: string }) {
    return (
        <div className="flex items-center gap-3 p-3.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.70)", border: "1px solid rgba(81,133,145,0.10)" }}>
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: `${iconColor}12` }}>
                <Icon className="h-4 w-4" style={{ color: iconColor }} />
            </div>
            <div>
                <div className="font-body text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "rgba(44,62,59,0.50)" }}>{label}</div>
                <div className="font-body text-[13px] font-medium leading-snug mt-0.5" style={{ color: "#0f172a" }}>{value}</div>
            </div>
        </div>
    );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export function DiseaseCard({ id, disease, index }: DiseaseCardProps) {
    const [expanded, setExpanded] = useState(false);
    const Icon = ICON_MAP[disease.title] ?? Brain;
    const num = String(index + 1).padStart(2, "0");

    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            id={id}
            className="group relative"
        >
            {/* ── CARTE PRINCIPALE ── */}
            <div
                className="relative overflow-hidden transition-all duration-400"
                style={{
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.88)",
                    border: "1.5px solid rgba(81,133,145,0.12)",
                    boxShadow: "0 4px 32px -8px rgba(44,62,59,0.08)",
                    backdropFilter: "blur(16px)",
                }}
            >
                {/* Barre d'accent supérieure */}
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${disease.theme.primary}, ${disease.theme.accent})` }} />

                {/* Numéro décoratif */}
                <div aria-hidden className="pointer-events-none absolute top-6 right-8 font-display font-light leading-none select-none"
                    style={{ fontSize: "clamp(80px, 10vw, 140px)", color: `${disease.theme.primary}07`, letterSpacing: "-0.06em" }}>
                    {num}
                </div>

                <div className="relative p-8 md:p-10 lg:p-12">

                    {/* ══ EN-TÊTE ══ */}
                    <div className="flex flex-col md:flex-row md:items-start gap-6 mb-10">
                        {/* Icône */}
                        <motion.div
                            whileHover={{ scale: 1.06, rotate: 3 }}
                            transition={{ type: "spring", stiffness: 280 }}
                            className="flex h-16 w-16 flex-shrink-0 items-center justify-center"
                            style={{ borderRadius: "18px", background: `linear-gradient(135deg, ${disease.theme.primary}18, ${disease.theme.accent}12)`, border: `1px solid ${disease.theme.primary}20` }}
                        >
                            <Icon className="h-8 w-8" style={{ color: disease.theme.primary }} />
                        </motion.div>

                        {/* Texte titre */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h2 className="font-display font-light tracking-[-0.025em]"
                                    style={{ fontSize: "clamp(26px, 3.2vw, 40px)", lineHeight: 1.05, color: "#0f172a" }}>
                                    {disease.title}
                                </h2>
                                <span className="rounded-full px-3.5 py-1 font-body text-[11px] font-semibold text-white"
                                    style={{ background: `linear-gradient(135deg, ${disease.theme.primary}, ${disease.theme.accent})` }}>
                                    {disease.stats.split(" ")[1] ?? disease.stats.slice(0, 6)}
                                </span>
                            </div>

                            <p className="font-body text-[14px] font-semibold uppercase tracking-[0.14em] mb-3" style={{ color: disease.theme.primary }}>
                                {disease.fullName}
                            </p>

                            <p className="font-body text-[16px] leading-[1.75] max-w-2xl" style={{ color: "rgba(15,23,42,0.65)" }}>
                                {disease.description}
                            </p>
                        </div>
                    </div>

                    {/* ══ CHIPS DE STATS ══ */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
                        <StatChip icon={AlertCircle} label="Prevalence" value={disease.stats.slice(0, 24) + "…"} iconColor={disease.theme.primary} />
                        <StatChip icon={TrendingUp} label="Peak Onset" value="Adolescence / Early Adulthood" iconColor={disease.theme.primary} />
                        <StatChip icon={GraduationCap} label="Treatment Success" value="High with early intervention" iconColor={disease.theme.accent} />
                    </div>

                    {/* ══ TABS AVEC SHADCN UI ══ */}
                    <Tabs defaultValue="symptoms" className="mb-10">
                        <TabsList className="w-full justify-start bg-transparent border-b border-[rgba(81,133,145,0.12)] rounded-none h-auto p-0">
                            <TabsTrigger 
                                value="symptoms"
                                className="font-body text-[13px] font-semibold data-[state=active]:border-b-2 rounded-none px-4 py-2 transition-all duration-200"
                                style={{ 
                                    color: "rgba(15,23,42,0.65)",
                                    borderBottomWidth: "2px",
                                    borderBottomColor: "transparent"
                                }}
                            >
                                Symptoms
                            </TabsTrigger>
                            <TabsTrigger 
                                value="causes"
                                className="font-body text-[13px] font-semibold data-[state=active]:border-b-2 rounded-none px-4 py-2 transition-all duration-200"
                                style={{ 
                                    color: "rgba(15,23,42,0.65)",
                                    borderBottomWidth: "2px",
                                    borderBottomColor: "transparent"
                                }}
                            >
                                Causes & Risk Factors
                            </TabsTrigger>
                            <TabsTrigger 
                                value="treatments"
                                className="font-body text-[13px] font-semibold data-[state=active]:border-b-2 rounded-none px-4 py-2 transition-all duration-200"
                                style={{ 
                                    color: "rgba(15,23,42,0.65)",
                                    borderBottomWidth: "2px",
                                    borderBottomColor: "transparent"
                                }}
                            >
                                Treatments
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="symptoms" className="mt-6">
                            <SectionLabel color={disease.theme.primary}>Key Symptoms</SectionLabel>
                            <SymbolList items={disease.symptoms} color={disease.theme.primary} />
                        </TabsContent>

                        <TabsContent value="causes" className="mt-6">
                            <SectionLabel color={disease.theme.accent}>Contributing Factors</SectionLabel>
                            <SymbolList items={disease.causes} color={disease.theme.accent} />
                        </TabsContent>

                        <TabsContent value="treatments" className="mt-6">
                            <SectionLabel color={disease.theme.primary}>
                                <span className="flex items-center gap-1.5"><Pill className="h-3 w-3" />Treatment Approaches</span>
                            </SectionLabel>
                            <SymbolList items={disease.treatments} color={disease.theme.primary} />
                        </TabsContent>
                    </Tabs>

                    {/* ══ PROGNOSIS SECTION ══ */}
                    <div className="p-5 rounded-2xl mb-8" style={{ background: "linear-gradient(135deg, rgba(81,133,145,0.06), rgba(227,176,28,0.04))", border: "1px solid rgba(81,133,145,0.12)" }}>
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(81,133,145,0.10)" }}>
                                <TrendingUp className="h-4 w-4" style={{ color: "#518591" }} />
                            </div>
                            <div>
                                <h4 className="font-display text-[16px] font-medium tracking-[-0.01em] mb-1.5" style={{ color: "#0f172a" }}>
                                    Clinical Prognosis
                                </h4>
                                <p className="font-body text-[14px] leading-[1.75]" style={{ color: "rgba(15,23,42,0.62)" }}>
                                    {disease.prognosis}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ══ BOUTON EXPAND POUR PLUS DE DÉTAILS ══ */}
                     <Button
                         type="button"
                         variant="outline"
                         aria-expanded={expanded}
                         aria-controls={`disease-details-${id}`}
                         onClick={() => setExpanded(e => !e)}
                         className="inline-flex items-center gap-2 px-5 py-2.5"
                        style={{
                            borderRadius: "12px",
                            background: `${disease.theme.primary}0E`,
                            border: `1px solid ${disease.theme.primary}20`,
                            color: disease.theme.primary,
                        }}
                    >
                        <span className="font-body text-[13px] font-semibold">
                            {expanded ? "Show Less" : "View Complete Clinical Profile"}
                        </span>
                        {expanded
                            ? <ChevronUp className="h-4 w-4 transition-transform duration-200 -translate-y-px" />
                            : <ChevronDown className="h-4 w-4 transition-transform duration-200 translate-y-px" />
                        }
                     </Button>

                    {/* ══ CONTENU EXPANDED ══ */}
                    <AnimatePresence>
                        {expanded && (
                             <motion.div
                                 id={`disease-details-${id}`}
                                 initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                className="overflow-hidden"
                            >
                                <div className="mt-10 pt-10" style={{ borderTop: "1px solid rgba(81,133,145,0.12)" }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <SectionLabel color={disease.theme.primary}>Research Insights</SectionLabel>
                                            <ul className="space-y-3">
                                                <li className="font-body text-[14px] leading-[1.65]" style={{ color: "rgba(15,23,42,0.65)" }}>
                                                    • Latest clinical trials show promising outcomes with integrated treatment approaches
                                                </li>
                                                <li className="font-body text-[14px] leading-[1.65]" style={{ color: "rgba(15,23,42,0.65)" }}>
                                                    • Neuroimaging studies reveal distinct biomarkers for early diagnosis
                                                </li>
                                                <li className="font-body text-[14px] leading-[1.65]" style={{ color: "rgba(15,23,42,0.65)" }}>
                                                    • Genetic research identifies key susceptibility genes
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <SectionLabel color={disease.theme.accent}>Support Resources</SectionLabel>
                                            <ul className="space-y-3">
                                                <li className="font-body text-[14px] leading-[1.65]" style={{ color: "rgba(15,23,42,0.65)" }}>
                                                    • Patient advocacy groups and online communities
                                                </li>
                                                <li className="font-body text-[14px] leading-[1.65]" style={{ color: "rgba(15,23,42,0.65)" }}>
                                                    • Educational materials for families and caregivers
                                                </li>
                                                <li className="font-body text-[14px] leading-[1.65]" style={{ color: "rgba(15,23,42,0.65)" }}>
                                                    • Directory of specialized healthcare providers
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}