"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Download,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { copy } from "@/lib/i18n";
import { useSpeech } from "@/hooks/useSpeech";
import type { MiraAssessmentResult } from "@/hooks/useMiraChat";

interface MiraResultProps {
  result: MiraAssessmentResult;
  transcript: Array<{ role: "user" | "assistant"; content: string }>;
  sessionId: string;
  onRestart: () => void;
}

export function MiraResult({ result, sessionId, onRestart }: MiraResultProps) {
  const { dictionary } = useLanguage();
  const reportCopy = copy[result.language];
  const reportDictionary = reportCopy.diagnostic;
  const mira = reportDictionary.mira;
  const reportLanguage = result.language;

  const entries = Object.entries(result.condition_scores || {}).sort((a, b) => b[1] - a[1]);
  const pathwayLabel = result.orientation;

  const spokenReport = [
    mira.recommendationTitle,
    pathwayLabel,
    `${mira.matchStrength}: ${result.match_strength}`,
    ...entries.map(([name, score]) => {
      return `${name}: ${Math.round(score * 100)}%`;
    }),
    ...(result.supporting_features.length > 0
      ? [`${mira.supportingTitle}: ${result.supporting_features.join(". ")}`]
      : []),
    ...(result.contradictory_features.length > 0
      ? [`${mira.contradictoryTitle}: ${result.contradictory_features.join(". ")}`]
      : []),
    ...(result.recommended_test ? [`${mira.nextStep}: ${result.recommended_test}`] : []),
    result.disclaimer,
  ].join(". ");

  const { state: speech, toggle } = useSpeech(spokenReport, reportLanguage);
  const speaking = speech === "speaking" || speech === "loading";

  const signupHref = `/auth/signup?sessionId=${encodeURIComponent(sessionId)}&redirect=${encodeURIComponent("/dashboard")}`;

  // Enhanced hero meta — premium orientation at a glance
  const heroGradient =
    result.recommended_pathway === "NO_STRONG_TARGET_SIGNAL"
      ? "from-slate-50 via-white to-primary/5"
      : result.match_strength === "HIGH"
        ? "from-primary/10 via-primary/5 to-white"
        : "from-amber-50 via-white to-primary/5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="w-full max-w-3xl mx-auto"
      dir={result.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[24px] w-full shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Header · enhanced with hero */}
        <div className={`px-6 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-br ${heroGradient} border-b border-white/60`}>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              {mira.recommendationTitle}
            </span>
            <span className="hidden sm:inline-flex items-center rounded-full bg-white/70 border border-white/60 px-2 py-0.5 text-[10px] font-bold tracking-wide text-primary/70">
              {result.match_strength}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              aria-label={speaking ? reportDictionary.stopListening : mira.readAloud}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3.5 py-2 text-xs font-bold text-gray-700 shadow-sm backdrop-blur-md transition-all hover:border-primary/30 hover:text-primary hover:shadow focus-visible:outline-2 focus-visible:outline-primary"
            >
              {speech === "loading" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : speaking ? (
                <VolumeX className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <Volume2 className="h-3.5 w-3.5" aria-hidden />
              )}
              <span aria-live="polite" className="hidden sm:inline">{speaking ? reportDictionary.listening : mira.readAloud}</span>
              <span aria-live="polite" className="sm:hidden">{speaking ? "◼" : "▶"}</span>
            </button>
            <button
              type="button"
              onClick={async () => {
                try { await navigator.clipboard.writeText(sessionId); } catch { }
              }}
              title={`${dictionary.diagnostic.session}: ${sessionId}`}
              className="text-[10px] font-mono text-gray-500 bg-white/70 px-2.5 py-1.5 rounded-full border border-white/60 shadow-sm hover:bg-white hover:text-primary transition-colors"
            >
              ID: {sessionId.slice(0, 8)} · ⧉
            </button>
          </div>
        </div>

        {/* Content · hero orientation */}
        <div className="px-5 sm:px-8 lg:px-10 pb-8 sm:pb-10 space-y-6">
          <div className={`rounded-[20px] border bg-gradient-to-br p-5 sm:p-6 shadow-sm ${heroGradient} border-white/60`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70">
                  {reportLanguage === "ar" ? "نتيجة التوجيه" : "Orientation result"}
                </p>
                <h2 className="mt-1 text-xl sm:text-[22px] font-bold text-gray-800 tracking-tight leading-snug">
                  {pathwayLabel}
                </h2>
              </div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide border backdrop-blur-md ${result.match_strength === "HIGH" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                result.match_strength === "MODERATE" ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-gray-50 text-gray-600 border-gray-200"
                }`}>
                {mira.matchStrength}: {result.match_strength}
              </span>
            </div>
            <p className="mt-3 text-xs leading-5 text-gray-500">{result.disclaimer}</p>
          </div>

          {result.safety.level === "urgent" && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" aria-hidden />
              <div>
                <p className="text-sm font-bold text-red-700">{result.safety.level}</p>
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
                        {name}
                      </p>
                      <p className="text-xs font-mono text-gray-400 tabular-nums" aria-label={`${percent}%`}>
                        {score.toFixed(3)}
                      </p>
                    </div>
                    <div
                      role="progressbar"
                      aria-label={name}
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
          {result.supporting_features.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <section
                aria-label={mira.supportingTitle}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
              >
                <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  {mira.supportingTitle}
                </h3>
                <ul className="space-y-2">
                  {result.supporting_features.map((feature) => (
                    <li key={feature} className="rounded-xl border border-gray-100 bg-gray-50/60 px-3.5 py-2.5 text-[13px] leading-6 text-gray-600">
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2.5">
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
