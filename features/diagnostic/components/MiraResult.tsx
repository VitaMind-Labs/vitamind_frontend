"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Compass,
  Copy,
  Download,
  Info,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Volume2,
  VolumeX,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { copy } from "@/lib/i18n/config";
import { fadeUp, stagger } from "@/lib/motion";
import { useSpeech } from "@/hooks/useSpeech";
import type { MiraAssessmentResult } from "../types";
import { MatchStrengthMeter, SignalGauge, SignalList, SignalRadar, type SignalDatum } from "./SignalCharts";

interface MiraResultProps {
  result: MiraAssessmentResult;
  transcript: Array<{ role: "user" | "assistant"; content: string }>;
  sessionId: string;
  onRestart: () => void;
}

function humanize(key: string) {
  const text = key.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function ObservationCard({
  title,
  icon,
  items,
  tone = "default",
}: {
  title: string;
  icon: ReactNode;
  items: string[];
  tone?: "default" | "muted";
}) {
  if (items.length === 0) return null;
  return (
    <motion.section
      variants={fadeUp(0, 12)}
      aria-label={title}
      className={tone === "muted" ? "rounded-card border border-line bg-surface-muted p-5 sm:p-6" : "surface-card p-5 sm:p-6"}
    >
      <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
        {icon}
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-ink-soft">
            <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
            <span className="min-w-0">{item}</span>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

export function MiraResult({ result, sessionId, onRestart }: MiraResultProps) {
  const { dictionary } = useLanguage();
  const reportCopy = copy[result.language];
  const reportDictionary = reportCopy.diagnostic;
  const mira = reportDictionary.mira;
  const reportLanguage = result.language;
  const pathways = reportDictionary.pathways as Record<string, string>;
  const [copied, setCopied] = useState(false);

  const entries = Object.entries(result.condition_scores || {}).sort((a, b) => b[1] - a[1]);
  const pathwayLabel = result.orientation;

  const signals: SignalDatum[] = entries.map(([key, score]) => ({
    key,
    label: pathways[key] ?? humanize(key),
    percent: Math.max(0, Math.min(100, Math.round(score * 100))),
    raw: score,
  }));
  const strongest = signals[0];

  const spokenReport = [
    mira.recommendationTitle,
    pathwayLabel,
    `${mira.matchStrength}: ${result.match_strength}`,
    ...entries.map(([name, score]) => `${name}: ${Math.round(score * 100)}%`),
    ...(result.supporting_features.length > 0
      ? [`${mira.supportingTitle}: ${result.supporting_features.join(". ")}`]
      : []),
    ...(result.contradictory_features.length > 0 ? [result.contradictory_features.join(". ")] : []),
    ...(result.recommended_test ? [`${mira.nextStep}: ${result.recommended_test}`] : []),
    result.disclaimer,
  ].join(". ");

  const { state: speech, toggle } = useSpeech(spokenReport, reportLanguage);
  const speaking = speech === "speaking" || speech === "loading";

  const signupHref = `/auth/signup?sessionId=${encodeURIComponent(sessionId)}&redirect=${encodeURIComponent("/dashboard")}`;

  async function copySessionId() {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <motion.div
      variants={stagger(0.08)}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-5xl space-y-5"
      dir={result.language === "ar" ? "rtl" : "ltr"}
    >
      {/* ── 1. Orientation summary ── */}
      <motion.section variants={fadeUp(0, 14)} className="relative overflow-hidden rounded-card border border-line bg-white shadow-raised">
        <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-teal-500),var(--color-sage),var(--color-gold))]" />
        <div className="flex flex-col gap-6 p-5 sm:p-8 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 max-w-2xl">
            <p className="home-eyebrow inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sage" aria-hidden />
              {mira.recommendationTitle}
            </p>
            <p className="mt-4 text-xs text-ink-muted">{mira.orientationResult}</p>
            <h1 className="mt-1 text-title font-semibold tracking-[-0.01em] text-ink">{pathwayLabel}</h1>
            {pathways[result.recommended_pathway] && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
                <Compass className="h-3.5 w-3.5" aria-hidden />
                {pathways[result.recommended_pathway]}
              </p>
            )}
            <div className="mt-5">
              <MatchStrengthMeter
                level={result.match_strength}
                label={mira.matchStrength}
                levelLabel={mira.matchLevels[result.match_strength] ?? result.match_strength}
              />
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 md:flex-col md:items-stretch">
            <Button type="button" variant="outline" size="sm" onClick={toggle} aria-label={speaking ? reportDictionary.stopListening : mira.readAloud} className="min-h-10">
              {speech === "loading" ? <Loader2 className="animate-spin" aria-hidden /> : speaking ? <VolumeX aria-hidden /> : <Volume2 aria-hidden />}
              <span aria-live="polite">{speaking ? reportDictionary.listening : mira.readAloud}</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={copySessionId}
              title={`${dictionary.diagnostic.session}: ${sessionId}`}
              className="min-h-10 text-ink-muted"
            >
              {copied ? <Check className="text-sage-700" aria-hidden /> : <Copy aria-hidden />}
              <span className="font-mono text-xs" dir="ltr">{sessionId.slice(0, 8)}</span>
            </Button>
          </div>
        </div>
      </motion.section>

      {result.safety.level === "urgent" && (
        <motion.div variants={fadeUp(0, 12)} role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 sm:p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" aria-hidden />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-rose-700">{reportDictionary.urgentTitle}</p>
            <p className="mt-1 text-sm leading-6 text-rose-700/90">{reportDictionary.urgentBody}</p>
            {result.safety.flags.length > 0 && (
              <p className="mt-2 text-xs text-rose-700/80">
                {mira.flagsTitle}: {result.safety.flags.join(", ")}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* ── 2. Signal comparison: radar chart + exact numbers + strongest-signal highlight ── */}
      {signals.length > 0 && (
        <motion.section variants={fadeUp(0, 12)} aria-labelledby="signals-title" className="surface-card p-5 sm:p-7">
          <h2 id="signals-title" className="text-base font-semibold text-ink">{mira.scoresTitle}</h2>
          <p className="mt-1 text-sm text-ink-muted">{mira.scoresHint}</p>

          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-8">
            <div className="min-w-0 rounded-2xl border border-line bg-surface-muted/60 p-2 sm:p-4">
              <SignalRadar data={signals} label={mira.scoresTitle} />
            </div>

            <div className="flex min-w-0 flex-col gap-5">
              {strongest && (
                <div className="flex items-center justify-center gap-4 rounded-2xl border border-teal-100 bg-teal-50/60 p-4 sm:justify-start">
                  <SignalGauge percent={strongest.percent} label={strongest.label} caption={mira.strongestSignal} />
                </div>
              )}
              <div className="min-w-0 border-t border-line pt-4">
                <SignalList data={signals} />
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ── 3. Observations ── */}
      <div className="grid gap-5 md:grid-cols-2">
        <ObservationCard
          title={mira.supportingTitle}
          icon={<Check className="h-4 w-4 text-sage-700" aria-hidden />}
          items={result.supporting_features}
        />
        <ObservationCard
          title={mira.flagsTitle}
          icon={<XCircle className="h-4 w-4 text-rose-700" aria-hidden />}
          items={result.contradictory_features}
          tone="muted"
        />
      </div>

      {result.recommended_test && (
        <motion.section variants={fadeUp(0, 12)} className="rounded-card border border-teal-100 bg-teal-50/70 p-5 sm:p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-teal-800">
            <Compass className="h-4 w-4" aria-hidden />
            {mira.nextStep}
          </h3>
          <p className="mt-3 text-sm leading-6 text-ink">{result.recommended_test}</p>
        </motion.section>
      )}

      {/* ── 4. Clinical note + actions ── */}
      <motion.section variants={fadeUp(0, 12)} className="surface-card p-5 sm:p-7">
        <div className="flex items-start gap-3 rounded-2xl bg-gold-50 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" aria-hidden />
          <div className="min-w-0 text-sm leading-6 text-ink-soft">
            <p className="font-semibold text-ink">{mira.noteTitle}</p>
            <p className="mt-1">{result.disclaimer || mira.screeningNote}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          <Button type="button" variant="default" size="lg" onClick={onRestart}>
            <RefreshCw aria-hidden />
            {mira.newSession}
          </Button>
          <Button asChild variant="outline" size="lg" className="group">
            <Link href={signupHref}>
              {dictionary.diagnostic.result.signupCta}
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-start gap-2 text-xs leading-5 text-ink-muted">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage-700" aria-hidden />
            <span>
              {mira.privacyTitle} · {mira.privacyBody}
            </span>
          </p>
          <Button type="button" variant="ghost" size="sm" onClick={() => window.print()} className="self-start text-ink-soft sm:self-auto">
            <Download aria-hidden />
            {mira.download}
          </Button>
        </div>
      </motion.section>
    </motion.div>
  );
}