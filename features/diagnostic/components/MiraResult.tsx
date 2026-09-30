"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Check,
  Compass,
  Copy,
  Download,
  Gauge,
  Info,
  ListChecks,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
  Target,
  Volume2,
  VolumeX,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { copy, LANGS } from "@/lib/i18n/config";
import { fill } from "@/lib/i18n/format";
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useSpeech } from "@/hooks/useSpeech";
import type { MiraAssessmentResult } from "../types";
import { buildSignupHref } from "../lib/funnel";
import { MatchStrengthMeter, SignalGauge, SignalList, SignalRadar, type SignalDatum } from "./SignalCharts";
import { LogoSpinner } from "@/components/shared/LogoLoader";

interface MiraResultProps {
  result: MiraAssessmentResult;
  transcript: Array<{ role: "user" | "assistant"; content: string }>;
  sessionId: string;
  onRestart: () => void;
  /** Finalizes the session (consumes one attempt) then produces the downloadable report. */
  onDownload?: () => void | Promise<void>;
  isFinalizing?: boolean;
  /** Visitor's first name, reused only to address them warmly (never a report data field). */
  viewerName?: string;
  /** When the conversation finished (last transcript message), shown in the report header. */
  completedAt?: string | null;
}

function humanize(key: string) {
  const text = key.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Machine keys (e.g. `decreased_need_for_sleep`) read as sentences; free text is left untouched. */
function readable(item: string) {
  return /^[a-z0-9]+(?:[_.][a-z0-9]+)+$/i.test(item) ? humanize(item.replace(/\./g, " · ")) : item;
}

/** Display form of Mira's orientation: drop the machine "orientation:" prefix, capitalise. Same field. */
function displayOrientation(orientation: string) {
  const text = orientation.replace(/^\s*orientation\s*:\s*/i, "").trim() || orientation;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Section title with the shared brand icon tile. */
function SectionTitle({ id, icon, title, hint }: { id?: string; icon: ReactNode; title: string; hint?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="home-icon h-10 w-10 rounded-xl print:hidden">{icon}</span>
      <div className="min-w-0">
        <h2 id={id} className="text-base font-semibold text-ink sm:text-lg">{title}</h2>
        {hint && <p className="mt-0.5 text-sm text-ink-muted">{hint}</p>}
      </div>
    </div>
  );
}

/**
 * One "at a glance" figure: icon tile, label, value. Hairlines between tiles follow the
 * grid (1 → 2 → 4 columns) via logical borders, so RTL mirrors for free.
 */
function MetricTile({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <motion.div
      variants={fadeUp(0, 8)}
      className={cn(
        "group min-w-0 border-line p-5 transition-colors duration-300 hover:bg-white sm:p-6",
        "border-b last:border-b-0",
        "sm:[&:nth-child(odd)]:border-e sm:[&:nth-child(n+3)]:border-b-0",
        "lg:border-b-0 lg:border-e lg:last:border-e-0",
      )}
    >
      <dt className="flex items-center gap-2 text-xs font-medium text-ink-muted">
        <span
          aria-hidden
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-teal-700 shadow-xs ring-1 ring-line transition-transform duration-300 ease-out-soft group-hover:-translate-y-0.5 print:hidden"
        >
          {icon}
        </span>
        {label}
      </dt>
      <dd className="mt-3 min-w-0">{children}</dd>
    </motion.div>
  );
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
      className={cn(
        "rounded-card border p-5 sm:p-6",
        "transition-[transform,box-shadow] duration-300 ease-out-soft",
        tone === "muted" ? "border-line bg-surface-muted/70" : "border-line bg-white shadow-card hover:-translate-y-0.5 hover:shadow-raised",
      )}
    >
      <h3 className="flex items-center gap-2.5 text-sm font-semibold text-ink">
        <span
          aria-hidden
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full",
            tone === "muted" ? "bg-rose-50 text-rose-700" : "bg-sage-50 text-sage-700",
          )}
        >
          {icon}
        </span>
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-ink-soft">
            <span aria-hidden className={cn("mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full", tone === "muted" ? "bg-rose" : "bg-teal-400")} />
            <span className="min-w-0">{readable(item)}</span>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

export function MiraResult({ result, sessionId, onRestart, onDownload, isFinalizing, viewerName, completedAt }: MiraResultProps) {
  const { dictionary } = useLanguage();
  const reportCopy = copy[result.language];
  const reportDictionary = reportCopy.diagnostic;
  const mira = reportDictionary.mira;
  const resultPage = reportDictionary.resultPage;
  const reportLanguage = result.language;
  const pathways = reportDictionary.pathways as Record<string, string>;
  const [copied, setCopied] = useState(false);

  const entries = Object.entries(result.condition_scores || {}).sort((a, b) => b[1] - a[1]);
  const pathwayLabel = displayOrientation(result.orientation);
  const observationColumns = [result.supporting_features, result.contradictory_features].filter((items) => items.length > 0).length;

  const signals: SignalDatum[] = entries.map(([key, score]) => ({
    key,
    label: pathways[key] ?? pathways[key.toUpperCase()] ?? humanize(key),
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

  // Conversion funnel: signup → subscription → dashboard. Carry the session so it links to the new account.
  const signupHref = buildSignupHref(sessionId);
  const heroTitle = viewerName ? fill(resultPage.heroTitleNamed, { name: viewerName }) : resultPage.heroTitle;
  const urgent = result.safety.level === "urgent";
  const metricsCopy = resultPage.metrics;
  const completedDate = completedAt ? new Date(completedAt) : null;
  const completedLabel =
    completedDate && !Number.isNaN(completedDate.getTime())
      ? fill(resultPage.generatedOn, {
          date: completedDate.toLocaleDateString(LANGS.find((l) => l.code === reportLanguage)?.bcp47 ?? "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            numberingSystem: "latn",
          }),
        })
      : null;

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
      {/* ── 1. Hero: the orientation at a glance — a clean white report header ── */}
      <motion.section
        variants={fadeUp(0, 14)}
        aria-labelledby="orientation-result-title"
        className="result-hero relative overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-float"
      >
        <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-teal-600),var(--color-sage),var(--color-gold))] rtl:bg-[linear-gradient(270deg,var(--color-teal-600),var(--color-sage),var(--color-gold))] print:hidden" />
        <span aria-hidden className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,var(--color-teal-50),transparent_68%)] print:hidden" />

        <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:gap-10">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <p className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                <span aria-hidden className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-sage opacity-60 motion-safe:animate-ping" />
                  <span className="relative h-2 w-2 rounded-full bg-sage" />
                </span>
                {resultPage.heroEyebrow}
              </p>
              {completedLabel && (
                <p className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                  {completedLabel}
                </p>
              )}
            </div>

            <p className="mt-6 text-base text-ink-muted sm:text-lg">{heroTitle}</p>
            <p className="mt-5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-teal-700 rtl:tracking-normal">
              {mira.orientationResult}
            </p>
            <h1
              id="orientation-result-title"
              className="mt-2 max-w-2xl text-[clamp(1.75rem,1.6vw+1.2rem,2.625rem)] font-light leading-[1.12] tracking-[-0.025em] text-ink rtl:font-normal"
            >
              {pathwayLabel}
            </h1>
            <p className="mt-4 max-w-xl text-[0.9375rem] leading-7 text-ink-muted">{resultPage.heroBody}</p>
            {pathways[result.recommended_pathway] && (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface-muted/70 px-3.5 py-1.5 text-xs font-semibold text-ink-soft">
                <Compass className="h-3.5 w-3.5 text-teal-700" aria-hidden />
                {pathways[result.recommended_pathway]}
              </p>
            )}
          </div>

          {/* Actions — screen only. */}
          <div className="flex flex-col gap-2 self-start rounded-2xl border border-line bg-surface-muted/60 p-3 print:hidden">
            <Button
              type="button"
              size="lg"
              onClick={toggle}
              aria-label={speaking ? reportDictionary.stopListening : mira.readAloud}
              className="h-auto min-h-12 w-full justify-start whitespace-normal py-2.5 text-start shadow-brand"
            >
              {speech === "loading" ? <LogoSpinner size={18} /> : speaking ? <VolumeX aria-hidden /> : <Volume2 aria-hidden />}
              <span aria-live="polite">{speaking ? reportDictionary.listening : mira.readAloud}</span>
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => (onDownload ? void onDownload() : window.print())}
              disabled={isFinalizing}
              aria-busy={isFinalizing}
              className="h-auto min-h-12 w-full justify-start whitespace-normal bg-white py-2.5 text-start"
            >
              {isFinalizing ? <LogoSpinner size={18} /> : <Download aria-hidden />}
              <span>{mira.download}</span>
            </Button>
            <button
              type="button"
              onClick={copySessionId}
              title={`${dictionary.diagnostic.session}: ${sessionId}`}
              className="mt-1 inline-flex min-h-9 cursor-pointer items-center justify-center gap-1.5 rounded-xl text-xs text-ink-muted transition-colors hover:bg-white hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-500"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-sage-700" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
              {dictionary.diagnostic.session}
              <span className="font-mono" dir="ltr">{sessionId.slice(0, 8)}</span>
            </button>
          </div>
        </div>

        {/* At a glance — the four figures a reader (or a clinician) looks for first. */}
        <div className="relative border-t border-line bg-[linear-gradient(180deg,var(--color-surface-muted),#fff)]">
          <h2 className="sr-only">{metricsCopy.title}</h2>
          <motion.dl variants={stagger(0.07, 0.2)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <MetricTile icon={<Gauge className="h-4 w-4" />} label={metricsCopy.match}>
              <MatchStrengthMeter
                level={result.match_strength}
                label={metricsCopy.match}
                levelLabel={mira.matchLevels[result.match_strength] ?? result.match_strength}
                hideLabel
              />
            </MetricTile>
            <MetricTile icon={<Target className="h-4 w-4" />} label={metricsCopy.strongest}>
              {strongest ? (
                <>
                  <p className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-semibold tabular-nums text-ink" dir="ltr">{strongest.percent}</span>
                    <span className="text-xs text-ink-muted" dir="ltr">/100</span>
                  </p>
                  <p className="mt-0.5 truncate text-sm text-ink-soft">{strongest.label}</p>
                  <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-teal-100">
                    <motion.span
                      className="block h-full origin-left rounded-full bg-[linear-gradient(90deg,var(--color-teal-600),var(--color-sage))] rtl:origin-right"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: strongest.percent / 100 }}
                      transition={{ duration: 0.9, delay: 0.4, ease: EASE_OUT }}
                    />
                  </span>
                </>
              ) : (
                <p className="text-sm text-ink-muted">—</p>
              )}
            </MetricTile>
            <MetricTile icon={<ListChecks className="h-4 w-4" />} label={metricsCopy.signals}>
              <p className="flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold tabular-nums text-ink">{signals.length}</span>
                <span className="text-sm text-ink-muted">{metricsCopy.signalsUnit}</span>
              </p>
            </MetricTile>
            <MetricTile icon={<Stethoscope className="h-4 w-4" />} label={urgent ? metricsCopy.safety : metricsCopy.review}>
              <p
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold",
                  urgent ? "bg-rose-50 text-rose-700" : result.requires_clinician_review ? "bg-teal-50 text-teal-800" : "bg-sage-50 text-sage-700",
                )}
              >
                <span aria-hidden className={cn("h-2 w-2 rounded-full", urgent ? "bg-rose" : result.requires_clinician_review ? "bg-teal-500" : "bg-sage")} />
                {urgent ? metricsCopy.safetyUrgent : result.requires_clinician_review ? metricsCopy.reviewRecommended : metricsCopy.reviewOptional}
              </p>
            </MetricTile>
          </motion.dl>
        </div>
      </motion.section>

      {urgent && (
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

      {/* ── 2. Signal comparison: radar + strongest signal + exact numbers ── */}
      {signals.length > 0 && (
        <motion.section variants={fadeUp(0, 12)} aria-labelledby="signals-title" className="surface-card p-5 sm:p-7">
          <SectionTitle id="signals-title" icon={<Activity className="h-5 w-5" aria-hidden />} title={mira.scoresTitle} hint={mira.scoresHint} />

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-8">
            <div className="min-w-0 rounded-2xl border border-line bg-[radial-gradient(circle_at_50%_45%,var(--color-teal-50),var(--color-surface-muted)_75%)] p-2 sm:p-4">
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
      <div className={cn("grid gap-5", observationColumns > 1 && "md:grid-cols-2")}>
        <ObservationCard
          title={mira.supportingTitle}
          icon={<Check className="h-4 w-4" aria-hidden />}
          items={result.supporting_features}
        />
        <ObservationCard
          title={mira.flagsTitle}
          icon={<XCircle className="h-4 w-4" aria-hidden />}
          items={result.contradictory_features}
          tone="muted"
        />
      </div>

      {/* ── 4. Suggested next step ── */}
      {result.recommended_test && (
        <motion.section
          variants={fadeUp(0, 12)}
          className="group relative overflow-hidden rounded-card border border-teal-100 bg-white p-5 shadow-card transition-shadow duration-300 hover:shadow-raised sm:p-7"
        >
          <span aria-hidden className="pointer-events-none absolute inset-y-0 start-0 w-1 bg-[linear-gradient(180deg,var(--color-teal-500),var(--color-sage))]" />
          <span aria-hidden className="pointer-events-none absolute -end-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,var(--color-teal-50),transparent_70%)] print:hidden" />
          <div className="relative flex items-start gap-4">
            <span aria-hidden className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_30%_25%,var(--color-teal-500),var(--color-teal-800))] text-white shadow-brand transition-transform duration-300 ease-out-soft group-hover:-rotate-6 print:hidden">
              <Compass className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-teal-800 rtl:tracking-normal">{mira.nextStep}</h2>
              <p className="mt-1.5 text-lg font-medium leading-7 text-ink first-letter:uppercase">{result.recommended_test}</p>
            </div>
          </div>
        </motion.section>
      )}

      {/* ── 5. Clinical note (part of the printed report) ── */}
      <motion.section variants={fadeUp(0, 12)} className="flex items-start gap-3 rounded-card border border-gold-100 bg-gold-50 p-5 sm:p-6">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" aria-hidden />
        <div className="min-w-0 text-sm leading-6 text-ink-soft">
          <p className="font-semibold text-ink">{mira.noteTitle}</p>
          <p className="mt-1">{result.disclaimer || mira.screeningNote}</p>
        </div>
      </motion.section>

      {/* ── 6. Actions (screen only) ── */}
      <motion.section variants={fadeUp(0, 12)} className="surface-card p-5 sm:p-6 print:hidden">
        <div className="grid gap-2.5 sm:grid-cols-2">
          {!urgent && (
            <Button asChild variant="default" size="lg" className="group shadow-brand">
              <Link href={signupHref}>
                {dictionary.diagnostic.result.signupCta}
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
              </Link>
            </Button>
          )}
          <Button type="button" variant="outline" size="lg" onClick={onRestart} className={cn(urgent && "sm:col-span-2")}>
            <RefreshCw aria-hidden />
            {mira.newSession}
          </Button>
        </div>
        <p className="mt-4 inline-flex items-start gap-2 border-t border-line pt-4 text-xs leading-5 text-ink-muted">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage-700" aria-hidden />
          <span>
            {mira.privacyTitle} · {mira.privacyBody}
          </span>
        </p>
      </motion.section>
    </motion.div>
  );
}
