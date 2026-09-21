"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Download,
  HeartHandshake,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSpeech } from "@/hooks/useSpeech";
import type { MiraAssessmentResult } from "@/hooks/useMiraChat";

interface MiraResultProps {
  result: MiraAssessmentResult;
  sessionId: string;
  onRestart: () => void;
}

const CONDITION_LABELS: Record<string, Record<string, string>> = {
  adhd: { en: "Attention regulation", ar: "تنظيم الانتباه" },
  bipolar: { en: "Mood energy", ar: "طاقة المزاج" },
  psychosis: { en: "Perception & thought", ar: "الإدراك والتفكير" },
};

function pathwayKey(pathway: string) {
  return pathway;
}

export function MiraResult({ result, sessionId, onRestart }: MiraResultProps) {
  const { dictionary, language, direction } = useLanguage();
  const mira = dictionary.diagnostic.mira;
  const pathways = dictionary.diagnostic.pathways;

  const entries = Object.entries(result.condition_scores || {}).sort((a, b) => b[1] - a[1]);
  const pathwayLabel =
    (pathways as Record<string, string>)[pathwayKey(result.recommended_pathway)] ||
    result.recommended_pathway;

  const spokenReport = [
    mira.recommendationTitle,
    pathwayLabel,
    `${mira.matchStrength}: ${result.match_strength}`,
    ...entries.map(([name, score]) => {
      const label = CONDITION_LABELS[name]?.[language] ?? name;
      return `${label}: ${Math.round(score * 100)}%`;
    }),
    ...(result.supporting_features.length > 0
      ? [`${mira.supportingTitle}: ${result.supporting_features.join(". ")}`]
      : []),
    ...(result.contradictory_features.length > 0
      ? [`${mira.contradictoryTitle}: ${result.contradictory_features.join(". ")}`]
      : []),
    ...(result.recommended_test ? [`${mira.nextStep}: ${result.recommended_test}`] : []),
    mira.screeningNote,
  ].join(". ");

  const { state: speech, toggle } = useSpeech(spokenReport, language);
  const speaking = speech === "speaking" || speech === "loading";

  const signupHref = `/auth/signup?sessionId=${encodeURIComponent(sessionId)}&redirect=${encodeURIComponent("/dashboard")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="w-full max-w-3xl mx-auto"
      dir={direction}
    >
      <div className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[24px] w-full shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              {mira.recommendationTitle}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              aria-label={speaking ? dictionary.diagnostic.stopListening : mira.readAloud}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-600 shadow-sm transition-all hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
            >
              {speech === "loading" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : speaking ? (
                <VolumeX className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <Volume2 className="h-3.5 w-3.5" aria-hidden />
              )}
              <span aria-live="polite">{speaking ? dictionary.diagnostic.listening : mira.readAloud}</span>
            </button>
            <span className="text-[10px] font-mono text-gray-300 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
              ID: {sessionId.slice(0, 8)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 sm:px-8 lg:px-10 pb-8 sm:pb-10 space-y-6">
          <div>
            <h2 className="text-2xl sm:text-[28px] font-bold text-gray-800 tracking-tight leading-snug">
              {pathwayLabel}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {mira.matchStrength}:{" "}
              <span className="font-bold text-gray-700">{result.match_strength}</span>
              {result.recommended_test ? (
                <>
                  {" · "}
                  {mira.nextStep}:{" "}
                  <span className="font-semibold text-gray-700">{result.recommended_test}</span>
                </>
              ) : null}
            </p>
          </div>

          {result.safety.level === "urgent" && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" aria-hidden />
              <div>
                <p className="text-sm font-bold text-red-700">{dictionary.diagnostic.urgentTitle}</p>
                <p className="mt-1 text-sm leading-6 text-red-600">{dictionary.diagnostic.urgentBody}</p>
                {result.safety.flags.length > 0 && (
                  <p className="mt-2 text-xs text-red-500">
                    {mira.flagsTitle}: {result.safety.flags.join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Condition signals */}
          <section aria-label={mira.scoresTitle}>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
              {mira.scoresTitle}
            </h3>
            <div className="space-y-3">
              {entries.map(([name, score], i) => {
                const percent = Math.max(0, Math.min(100, Math.round(score * 100)));
                return (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-gray-700">
                        {CONDITION_LABELS[name]?.[language] ?? name}
                      </p>
                      <p className="text-xs font-mono text-gray-400 tabular-nums" aria-label={`${percent}%`}>
                        {score.toFixed(3)}
                      </p>
                    </div>
                    <div
                      role="progressbar"
                      aria-label={CONDITION_LABELS[name]?.[language] ?? name}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={percent}
                      className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + i * 0.12, ease: [0.32, 0.72, 0, 1] }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Observations */}
          {(result.supporting_features.length > 0 || result.contradictory_features.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {result.supporting_features.length > 0 && (
                <section
                  aria-label={mira.supportingTitle}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                >
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-3">
                    {mira.supportingTitle}
                  </h3>
                  <ul className="space-y-2">
                    {result.supporting_features.map((feature) => (
                      <li
                        key={feature}
                        className="rounded-xl border border-gray-100 bg-gray-50/60 px-3.5 py-2.5 text-[13px] leading-6 text-gray-600"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {result.contradictory_features.length > 0 && (
                <section
                  aria-label={mira.contradictoryTitle}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                >
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-3">
                    {mira.contradictoryTitle}
                  </h3>
                  <ul className="space-y-2">
                    {result.contradictory_features.map((feature) => (
                      <li
                        key={feature}
                        className="rounded-xl border border-gray-100 bg-gray-50/60 px-3.5 py-2.5 text-[13px] leading-6 text-gray-600"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {/* Orientation */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-primary" aria-hidden />
              {dictionary.diagnostic.result.orientationTitle}
            </h3>
            <p className="rounded-xl bg-gray-50/60 border border-gray-100 p-4 text-sm leading-7 text-gray-600">
              {mira.screeningNote}
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={onRestart}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white text-sm font-semibold shadow-md shadow-primary/15 transition-all hover:shadow-lg active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <RefreshCw className="h-4 w-4" aria-hidden />
                {mira.newSession}
              </button>
              <Link
                href={signupHref}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-medium transition-all hover:border-primary/30 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
              >
                {dictionary.diagnostic.result.signupCta}
                <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-[11px] text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden />
            {mira.privacyTitle} · {mira.privacyBody}
          </p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.print();
            }}
            className="inline-flex items-center gap-2 text-[11px] font-bold text-gray-500 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary rounded"
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            {mira.download}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
