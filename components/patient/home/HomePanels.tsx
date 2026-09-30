"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Leaf, Send, Sparkles, Sun } from "lucide-react";
import { LuminaLogo } from "@/components/patient/ui/LuminaLogo";
import { GlassCard, Skeleton } from "@/components/patient/ui/primitives";
import { SparkPanel } from "@/components/patient/spark/SparkPanel";
import { PatientModal } from "@/components/patient/ui/PatientModal";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePatient } from "@/hooks/patient/usePatient";
import { useTodayCheckin } from "@/hooks/patient/useCheckin";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import { fill } from "@/lib/i18n/patient";
import { contentProvider, homePanelMode, type Article } from "@/lib/patient/content";
import { cn } from "@/lib/utils";

/**
 * Home's right column. What it shows follows the patient's track (see `homePanelMode`):
 * Spark's compact task list for ADHD, three curated reads for bipolar, schizophrenia and
 * psychosis, and a simple Lumina chat for anyone not yet oriented. Both are static for now and sit behind small seams
 * (`contentProvider`, the chat hand-off) so Lumina can drive them later.
 */
export function HomeSidePanel() {
  const { profile } = usePatient();
  const mode = homePanelMode(profile.track, profile.hasSpark);
  return mode === "reads" ? <ReadsPanel /> : mode === "spark" ? <SparkPanel /> : <LuminaChatPanel />;
}

function PanelHeader({ title, subtitle, badge }: { title: string; subtitle: string; badge?: string }) {
  return (
    <div className="flex items-center gap-3">
      <LuminaLogo size={44} presence />
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-semibold leading-tight text-ink">{title}</h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {badge && <span className="chip shrink-0"><Sparkles className="size-3" aria-hidden />{badge}</span>}
    </div>
  );
}

/** A small, static Lumina chat. Sending hands the message to the full Lumina chat. */
function LuminaChatPanel() {
  const copy = usePatientCopy();
  const router = useRouter();
  const today = useTodayCheckin();
  const [text, setText] = useState("");
  const chat = copy.home.lumina;

  const open = (prompt?: string) => {
    const query = prompt?.trim() ? `?prompt=${encodeURIComponent(prompt.trim())}` : "";
    router.push(`/dashboard/lumina${query}`);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    open(text);
  };

  return (
    <GlassCard as="aside" aria-label={chat.title} className="flex h-full flex-col gap-4">
      <PanelHeader title={chat.title} subtitle={chat.subtitle} />
      <p className="flex items-center gap-1.5 text-xs text-sage-700">
        <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-sage-700/50" style={{ animationDuration: "2.6s" }} /><span className="relative inline-flex size-2 rounded-full bg-sage-700" /></span>
        {chat.online}
      </p>

      <div className="flex flex-1 flex-col gap-3">
        {today.data?.luminaMessage && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="lm-bubble-lumina max-w-[92%] px-4 py-3 text-sm leading-relaxed text-ink">
            <p className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-teal-700 rtl:tracking-normal">{chat.lastFromLumina}</p>
            <p className="line-clamp-6 whitespace-pre-wrap" dir="auto">{today.data.luminaMessage}</p>
          </motion.div>
        )}
      </div>

      <Button variant="default" size="lg" className="w-full" onClick={() => open()}>
        {chat.continue}<ArrowRight className="rtl:-scale-x-100" aria-hidden />
      </Button>
      <form onSubmit={submit} className="flex items-center gap-2 rounded-full border border-white/80 bg-white/80 p-1.5 ps-4 focus-within:border-teal-400">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={chat.placeholder}
          aria-label={chat.placeholder}
          maxLength={500}
          dir="auto"
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink outline-none placeholder:text-muted-foreground"
        />
        <Button type="submit" size="icon" aria-label={copy.chat.send} disabled={!text.trim()}>
          <Send className="rtl:-scale-x-100" aria-hidden />
        </Button>
      </form>
    </GlassCard>
  );
}

const TONE_ICON = { teal: Sun, sage: Leaf, gold: Sparkles, rose: BookOpen } as const;
const TONE_BG: Record<Article["tone"], string> = {
  teal: "from-teal-100 to-teal-50 text-teal-700",
  sage: "from-sage-100 to-sage-50 text-sage-700",
  gold: "from-gold-100 to-gold-50 text-gold-700",
  rose: "from-rose-100 to-rose-50 text-rose-700",
};

/** Curated, static articles for tracks where reading beats chatting. */
function ReadsPanel() {
  const copy = usePatientCopy();
  const { language } = useLanguage();
  const { profile } = usePatient();
  const [open, setOpen] = useState<Article | null>(null);
  const articles = useMemo(() => contentProvider.articlesFor(profile.track, language), [profile.track, language]);
  const reads = copy.home.reads;

  return (
    <GlassCard as="aside" aria-label={reads.title} className="flex h-full flex-col gap-4">
      <PanelHeader title={reads.title} subtitle={reads.curated} badge={undefined} />
      <p className="text-sm leading-relaxed text-ink-soft">{reads.subtitle}</p>

      <ul className="flex flex-1 flex-col gap-3">
        {articles.map((article, index) => {
          const Icon = TONE_ICON[article.tone];
          return (
            <motion.li key={article.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07, duration: 0.4 }}>
              <button
                type="button"
                onClick={() => setOpen(article)}
                className="group flex w-full items-start gap-3.5 rounded-2xl border border-white/80 bg-white/70 p-3.5 text-start transition-all hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
              >
                <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br", TONE_BG[article.tone])}>
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-snug text-ink">{article.title}</span>
                  <span className="mt-1 line-clamp-2 block text-[0.8125rem] leading-snug text-muted-foreground">{article.summary}</span>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-teal-700">
                    <Clock className="size-3" aria-hidden />{fill(reads.readTime, { n: article.minutes })}
                  </span>
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>
      <p className="text-center text-xs text-muted-foreground">{reads.soon}</p>

      <PatientModal
        open={Boolean(open)}
        onOpenChange={(value) => !value && setOpen(null)}
        title={open?.title ?? ""}
        description={open?.summary}
        size="lg"
      >
        {open && (
          <article className="mt-5 space-y-5">
            {open.sections.map((section, index) => (
              <section key={index}>
                {section.heading && <h3 className="mb-1.5 text-sm font-semibold text-teal-800">{section.heading}</h3>}
                <p className="text-[0.9375rem] leading-relaxed text-ink-soft">{section.body}</p>
              </section>
            ))}
            <p className="rounded-xl bg-gold-50 px-3.5 py-2.5 text-xs text-gold-700">{reads.disclaimer}</p>
          </article>
        )}
      </PatientModal>
    </GlassCard>
  );
}

export function PanelSkeleton() {
  return (
    <GlassCard className="space-y-4">
      <Skeleton className="h-11 w-2/3" />
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
    </GlassCard>
  );
}
