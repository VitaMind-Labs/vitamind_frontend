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
import { MotionConfig, motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { Grain, WaveLines } from "@/components/home/Atmosphere";
import { CountUp } from "@/components/home/CountUp";
import { BODY_SM, DISPLAY_L, DISPLAY_M, DISPLAY_S, LABEL, SERIF } from "@/components/home/typography";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { copy, LANGS } from "@/lib/i18n/config";
import { fill } from "@/lib/i18n/format";
import { EASE_OUT, REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
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
  return /^[a-z0-9]+(?:[_.][a-z0-9]+)*$/i.test(item) ? humanize(item.replace(/\./g, " · ")) : item;
}

/** Display form of Mira's orientation: drop the machine "orientation:" prefix, capitalise. Same field. */
function displayOrientation(orientation: string) {
  const text = orientation.replace(/^\s*orientation\s*:\s*/i, "").trim() || orientation;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** The engine names its scores adhd / bipolar / psychosis; the copy is keyed by the spectrum names. */
const SCORE_KEYS: Record<string, string> = { adhd: "ADHD", bipolar: "BIPOLAR_SPECTRUM", psychosis: "PSYCHOSIS_SPECTRUM" };

/** Each block of the report reveals as it reaches the reader. */
const reveal = {
  variants: fadeUp(0, 22),
  initial: "hidden",
  whileInView: "show",
  viewport: REVEAL_VIEWPORT,
} as const;

/** Section title with the brand icon tile and a serif heading. */
function SectionTitle({ id, icon, title, hint }: { id?: string; icon: ReactNode; title: string; hint?: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 print:hidden">{icon}</span>
      <div className="min-w-0">
        <h2 id={id} className={cn(DISPLAY_S, "text-[clamp(1.5rem,1vw+1.2rem,2rem)] text-ink")}>
          {title}
        </h2>
        {hint && <p className={cn(BODY_SM, "mt-1.5")}>{hint}</p>}
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
      variants={fadeUp(0, 10)}
      className={cn(
        "group min-w-0 border-line p-5 transition-colors duration-300 hover:bg-teal-50/50 sm:p-7",
        "border-b last:border-b-0",
        "sm:[&:nth-child(odd)]:border-e sm:[&:nth-child(n+3)]:border-b-0",
        "lg:border-b-0 lg:border-e lg:last:border-e-0",
      )}
    >
      <dt className={cn(LABEL, "flex items-center gap-2.5 text-ink-soft")}>
        <span
          aria-hidden
          className="flex size-8 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition-transform duration-500 ease-out-soft group-hover:-translate-y-0.5 print:hidden"
        >
          {icon}
        </span>
        {label}
      </dt>
      <dd className="mt-4 min-w-0">{children}</dd>
    </motion.div>
  );
}

function ObservationCard({ title, icon, items, tone = "default" }: { title: string; icon: ReactNode; items: string[]; tone?: "default" | "muted" }) {
  if (items.length === 0) return null;
  return (
    <motion.section
      {...reveal}
      aria-label={title}
      className={cn(
        "rounded-panel border p-6 transition-[transform,box-shadow] duration-500 ease-out-soft sm:p-8",
        tone === "muted" ? "border-line bg-white/80" : "border-line bg-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft-hover)]",
      )}
    >
      <h3 className={cn(DISPLAY_S, "flex items-center gap-3 text-ink")}>
        <span
          aria-hidden
          className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", tone === "muted" ? "bg-rose-50 text-rose-700" : "bg-sage-50 text-sage-700")}
        >
          {icon}
        </span>
        {title}
      </h3>
      <ul className="mt-5 space-y-3.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-[1rem] leading-7 text-ink-soft">
            <span aria-hidden className={cn("mt-3 size-1.5 shrink-0 rounded-full", tone === "muted" ? "bg-rose" : "bg-gold")} />
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
  const observationColumns = [result.supporting_features, result.contradictory_features, result.missing_information].filter((items) => items.length > 0).length;

  const signals: SignalDatum[] = entries.map(([key, score]) => ({
    key,
    label: pathways[SCORE_KEYS[key] ?? key] ?? pathways[key.toUpperCase()] ?? humanize(key),
    percent: Math.max(0, Math.min(100, Math.round(score * 100))),
    raw: score,
  }));
  const strongest = signals[0];

  const spokenReport = [
    mira.recommendationTitle,
    pathwayLabel,
    `${mira.matchStrength}: ${result.match_strength}`,
    ...entries.map(([name, score]) => `${name}: ${Math.round(score * 100)}%`),
    ...(result.supporting_features.length > 0 ? [`${mira.supportingTitle}: ${result.supporting_features.join(". ")}`] : []),
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
    <MotionConfig reducedMotion="user">
      <div className="mx-auto w-full max-w-5xl space-y-5 lg:space-y-6" dir={result.language === "ar" ? "rtl" : "ltr"}>
        {/* ── 1. The cover: the orientation at a glance, on deep teal ─────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          aria-labelledby="orientation-result-title"
          className="result-hero relative isolate overflow-hidden rounded-[2rem] bg-deep text-white shadow-float"
        >
          <span className="print:hidden"><Grain /></span>
          <span className="print:hidden"><WaveLines tone="deep" className="inset-y-0" /></span>

          <div className="relative grid gap-10 p-7 pb-16 sm:p-11 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_18.5rem] lg:gap-14">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className={cn(LABEL, "inline-flex items-center gap-2.5 rounded-full border border-gold-300/40 bg-gold/10 px-3.5 py-1.5 text-gold-300")}>
                  <span aria-hidden className="relative flex size-2">
                    <span className="absolute inset-0 rounded-full bg-gold opacity-60 motion-safe:animate-ping" />
                    <span className="relative size-2 rounded-full bg-gold" />
                  </span>
                  {resultPage.heroEyebrow}
                </p>
                {completedLabel && (
                  <p className="inline-flex items-center gap-2 text-[0.875rem] text-teal-100">
                    <CalendarDays className="size-4" aria-hidden />
                    {completedLabel}
                  </p>
                )}
              </div>

              <p className="mt-9 text-[1.125rem] text-teal-100">{heroTitle}</p>
              <p className={cn(LABEL, "mt-6 text-teal-200")}>{mira.orientationResult}</p>
              <h1 id="orientation-result-title" className={cn(DISPLAY_L, "mt-3 max-w-3xl text-[clamp(2.25rem,3.8vw+1rem,4.25rem)] text-white")}>
                {pathwayLabel}
              </h1>
              <p className="mt-6 max-w-xl text-[1.0625rem] leading-8 text-teal-100">{resultPage.heroBody}</p>
              {pathways[result.recommended_pathway] && (
                <p className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[0.875rem] font-medium text-white">
                  <Compass className="size-4 text-gold-300" aria-hidden />
                  {pathways[result.recommended_pathway]}
                </p>
              )}
            </div>

            {/* Actions — screen only. */}
            <div className="flex flex-col gap-2.5 self-start rounded-3xl border border-white/15 bg-white/[0.07] p-3.5 backdrop-blur-sm print:hidden">
              <Button
                type="button"
                size="lg"
                onClick={toggle}
                aria-label={speaking ? reportDictionary.stopListening : mira.readAloud}
                className="h-auto min-h-13 w-full justify-start whitespace-normal bg-white py-2.5 text-start text-ink shadow-[0_18px_36px_-18px_rgb(0_0_0/0.6)] hover:bg-gold-100 hover:text-ink focus-visible:ring-offset-ink"
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
                className="h-auto min-h-13 w-full justify-start whitespace-normal border-white/25 bg-white/5 py-2.5 text-start text-white hover:border-white/50 hover:bg-white/10 hover:text-white focus-visible:ring-offset-ink"
              >
                {isFinalizing ? <LogoSpinner size={18} /> : <Download aria-hidden />}
                <span>{mira.download}</span>
              </Button>
              <button
                type="button"
                onClick={copySessionId}
                title={`${dictionary.diagnostic.session}: ${sessionId}`}
                className="mt-1 inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl text-[0.8125rem] text-teal-100 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-gold-300"
              >
                {copied ? <Check className="size-3.5 text-gold-300" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
                {dictionary.diagnostic.session}
                <span className="font-mono" dir="ltr">{sessionId.slice(0, 8)}</span>
              </button>
            </div>
          </div>
        </motion.section>

        {/* ── 2. At a glance — the four figures a reader (or a clinician) looks for first. Rests on the cover. ── */}
        <motion.section
          {...reveal}
          aria-labelledby="glance-title"
          className="relative z-10 -mt-14 overflow-hidden rounded-panel border border-line bg-white shadow-float sm:mx-6 sm:-mt-16 lg:mx-10 print:mx-0 print:mt-0"
        >
          <h2 id="glance-title" className="sr-only">{metricsCopy.title}</h2>
          <motion.dl variants={stagger(0.08, 0.1)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <MetricTile icon={<Gauge className="size-4" />} label={metricsCopy.match}>
              <MatchStrengthMeter
                level={result.match_strength}
                label={metricsCopy.match}
                levelLabel={mira.matchLevels[result.match_strength] ?? result.match_strength}
                hideLabel
              />
            </MetricTile>
            <MetricTile icon={<Target className="size-4" />} label={metricsCopy.strongest}>
              {strongest ? (
                <>
                  <p className="flex items-baseline gap-1.5">
                    <span className={cn(SERIF, "text-[2.5rem] font-light leading-none tracking-[-0.04em] tabular-nums text-ink")} dir="ltr">
                      <CountUp value={String(strongest.percent)} />
                    </span>
                    <span className="text-[0.8125rem] text-ink-muted" dir="ltr">/100</span>
                  </p>
                  <p className="mt-1.5 truncate text-[0.9375rem] text-ink-soft">{strongest.label}</p>
                  <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-teal-100">
                    <motion.span
                      className="block h-full origin-left rounded-full bg-[linear-gradient(90deg,var(--color-teal-600),var(--color-gold))] rtl:origin-right"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: strongest.percent / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: 0.3, ease: EASE_OUT }}
                    />
                  </span>
                </>
              ) : (
                <p className="text-[0.9375rem] text-ink-muted">—</p>
              )}
            </MetricTile>
            <MetricTile icon={<ListChecks className="size-4" />} label={metricsCopy.signals}>
              <p className="flex items-baseline gap-2">
                <span className={cn(SERIF, "text-[2.5rem] font-light leading-none tracking-[-0.04em] tabular-nums text-ink")}>
                  <CountUp value={String(signals.length)} />
                </span>
                <span className="text-[0.9375rem] text-ink-soft">{metricsCopy.signalsUnit}</span>
              </p>
            </MetricTile>
            <MetricTile icon={<Stethoscope className="size-4" />} label={urgent ? metricsCopy.safety : metricsCopy.review}>
              <p
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.9375rem] font-semibold",
                  urgent ? "bg-rose-50 text-rose-700" : result.requires_clinician_review ? "bg-teal-50 text-teal-800" : "bg-sage-50 text-sage-700",
                )}
              >
                <span aria-hidden className={cn("size-2 rounded-full", urgent ? "bg-rose" : result.requires_clinician_review ? "bg-teal-500" : "bg-sage")} />
                {urgent ? metricsCopy.safetyUrgent : result.requires_clinician_review ? metricsCopy.reviewRecommended : metricsCopy.reviewOptional}
              </p>
            </MetricTile>
          </motion.dl>
        </motion.section>

        {urgent && (
          <motion.div {...reveal} role="alert" className="flex items-start gap-4 rounded-panel border border-rose-100 bg-rose-50 p-5 sm:p-6">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-rose-700" aria-hidden />
            <div className="min-w-0">
              <p className="text-[1rem] font-semibold text-rose-700">{reportDictionary.urgentTitle}</p>
              <p className="mt-1.5 text-[0.9375rem] leading-7 text-rose-700/90">{reportDictionary.urgentBody}</p>
              {result.safety.flags.length > 0 && (
                <p className="mt-2 text-[0.8125rem] text-rose-700/85">
                  {mira.flagsTitle}: {result.safety.flags.join(", ")}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* ── 3. Signal comparison: radar + strongest signal + exact numbers ── */}
        {signals.length > 0 && (
          <motion.section {...reveal} aria-labelledby="signals-title" className="surface-card !rounded-panel p-6 sm:p-9">
            <SectionTitle id="signals-title" icon={<Activity className="size-5" strokeWidth={1.5} aria-hidden />} title={mira.scoresTitle} hint={mira.scoresHint} />

            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-9">
              <div className="min-w-0 rounded-3xl border border-teal-100 bg-[radial-gradient(circle_at_50%_45%,var(--color-teal-50),#ffffff_78%)] p-2 sm:p-5">
                <SignalRadar data={signals} label={mira.scoresTitle} />
              </div>

              <div className="flex min-w-0 flex-col gap-5">
                {strongest && (
                  <div className="flex items-center justify-center gap-4 rounded-3xl border border-gold-100 bg-gold-50/60 p-5 sm:justify-start">
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

        {/* ── 4. Observations ── */}
        <div className={cn("grid gap-5 lg:gap-6", observationColumns > 1 && (observationColumns > 2 ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2"))}>
          <ObservationCard title={mira.supportingTitle} icon={<Check className="size-4" aria-hidden />} items={result.supporting_features} />
          <ObservationCard title={mira.flagsTitle} icon={<XCircle className="size-4" aria-hidden />} items={result.contradictory_features} tone="muted" />
          <ObservationCard title={mira.missingTitle} icon={<Info className="size-4" aria-hidden />} items={result.missing_information} />
        </div>

        {/* ── 5. Suggested next step ── */}
        {result.recommended_test && (
          <motion.section
            {...reveal}
            className="group relative overflow-hidden rounded-panel border border-teal-100 bg-white p-6 shadow-[var(--shadow-soft)] transition-shadow duration-500 hover:shadow-[var(--shadow-soft-hover)] sm:p-9"
          >
            <span aria-hidden className="pointer-events-none absolute inset-y-6 start-0 w-1 rounded-full bg-[linear-gradient(180deg,var(--color-teal-500),var(--color-gold))]" />
            <span aria-hidden className="pointer-events-none absolute -end-16 -top-16 size-56 rounded-full bg-[radial-gradient(circle,var(--color-gold-100),transparent_70%)] print:hidden" />
            <div className="relative flex items-start gap-5">
              <span
                aria-hidden
                className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_30%_25%,var(--color-teal-600),var(--color-teal-900))] text-white shadow-brand transition-transform duration-500 ease-out-soft group-hover:-rotate-6 print:hidden"
              >
                <Compass className="size-6" strokeWidth={1.5} />
              </span>
              <div className="min-w-0">
                <h2 className={cn(LABEL, "text-teal-700")}>{mira.nextStep}</h2>
                <p className={cn(DISPLAY_M, "mt-3 text-[clamp(1.5rem,1.4vw+1.1rem,2.25rem)] first-letter:uppercase text-ink")}>{result.recommended_test}</p>
              </div>
            </div>
          </motion.section>
        )}

        {/* ── 6. Clinical note (part of the printed report) ── */}
        <motion.section {...reveal} className="flex items-start gap-4 rounded-panel border border-gold-100 bg-gold-50 p-6 sm:p-7">
          <Info className="mt-0.5 size-5 shrink-0 text-gold-700" aria-hidden />
          <div className="min-w-0 text-[0.9375rem] leading-7 text-ink-soft">
            <p className="text-[1rem] font-semibold text-ink">{mira.noteTitle}</p>
            <p className="mt-1.5">{result.disclaimer || mira.screeningNote}</p>
          </div>
        </motion.section>

        {/* ── 7. Actions (screen only) ── */}
        <motion.section {...reveal} className="surface-card !rounded-panel p-6 sm:p-8 print:hidden">
          <div className="grid gap-3 sm:grid-cols-2">
            {!urgent && (
              <Button asChild variant="default" size="lg" className="group min-h-14 shadow-brand">
                <Link href={signupHref}>
                  {dictionary.diagnostic.result.signupCta}
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
                </Link>
              </Button>
            )}
            <Button type="button" variant="outline" size="lg" onClick={onRestart} className={cn("min-h-14", urgent && "sm:col-span-2")}>
              <RefreshCw aria-hidden />
              {mira.newSession}
            </Button>
          </div>
          <p className="mt-5 inline-flex items-start gap-2.5 border-t border-line pt-5 text-[0.875rem] leading-6 text-ink-soft">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sage-700" aria-hidden />
            <span>
              {mira.privacyTitle} · {mira.privacyBody}
            </span>
          </p>
        </motion.section>
      </div>
    </MotionConfig>
  );
}
