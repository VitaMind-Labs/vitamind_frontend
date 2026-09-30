"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Send, ShieldAlert, Sparkles } from "lucide-react";
import { LuminaLogo, LuminaMessage, LuminaMotes, TypingRow } from "@/components/patient/chat/LuminaParts";
import { PageIntro } from "@/components/patient/ui/primitives";
import { AudioProvider } from "@/contexts/AudioContext";
import { Button } from "@/components/ui/button";
import { usePatient } from "@/hooks/patient/usePatient";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import { luminaApi, profileApi } from "@/lib/api/patient";
import { fill } from "@/lib/i18n/patient";
import { onboardingSteps, type OnboardingStep } from "@/lib/patient/onboarding";
import { cn } from "@/lib/utils";
import { LogoSpinner } from "@/components/shared/LogoLoader";

type Line = { id: string; role: "lumina" | "user"; text: string; createdAt: string };
type StepCopy = { prompt: string; options?: string[]; placeholder?: string };

/** During the intake Lumina asks the questions, so her own follow-up question is left out of her reply. */
function acknowledgement(reply: string, fallback: string): string {
  const sentences = reply.match(/[^.!?؟]+[.!?؟]+|[^.!?؟]+$/g) ?? [];
  const kept = sentences.filter((sentence) => !/[?؟]\s*$/.test(sentence)).join(" ").trim();
  return kept || fallback;
}

/**
 * Lumina's first conversation: a short, skippable intake that turns into the patient's own
 * explicit memories (never guessed). Choice answers are saved directly; the two free-text
 * answers also go through Lumina's chat so its safety layer reads them, and a crisis reply
 * pauses the flow and shows support before anything else.
 */
export function OnboardingChat() {
  return (
    <AudioProvider>
      <Onboarding />
    </AudioProvider>
  );
}

function Onboarding() {
  const copy = usePatientCopy();
  const router = useRouter();
  const { profile, name, refreshProfile } = usePatient();
  const [steps] = useState<OnboardingStep[]>(() => onboardingSteps(profile.track));
  const [index, setIndex] = useState(0);
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [nameMode, setNameMode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [crisis, setCrisis] = useState<string[] | null>(null);
  const [done, setDone] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  const step = steps[index] as OnboardingStep | undefined;
  const stepCopy = step ? (copy.onboarding.steps[step.copyKey as keyof typeof copy.onboarding.steps] as StepCopy) : null;

  // Lumina "types", then asks the next question.
  useEffect(() => {
    if (!step || !stepCopy) return;
    const timer = window.setTimeout(() => {
      setLines((current) => [...current, { id: `q:${step.key}`, role: "lumina", text: fill(stepCopy.prompt, { name }), createdAt: new Date().toISOString() }]);
      setTyping(false);
    }, index === 0 ? 500 : 750);
    return () => window.clearTimeout(timer);
    // The question text depends only on which step we are on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [lines.length, typing, crisis, done]);

  /** Marks the conversation finished on the server. The profile is refreshed only on leaving, so the finish screen stays. */
  async function markComplete() {
    await profileApi.completeOnboarding();
  }

  async function leave() {
    setBusy(true);
    try {
      await markComplete().catch(() => undefined);
      await refreshProfile();
    } finally {
      setBusy(false);
    }
    router.replace("/dashboard");
  }

  function advance() {
    setSelected([]);
    setDraft("");
    setNameMode(false);
    if (index + 1 >= steps.length) {
      setDone(true);
      void markComplete().catch(() => undefined);
      return;
    }
    setTyping(true);
    setIndex(index + 1);
  }

  async function answer(value: string, display: string = value) {
    if (!step || busy) return;
    setBusy(true);
    setLines((current) => [...current, { id: `a:${step.key}`, role: "user", text: display, createdAt: new Date().toISOString() }]);

    const saving = profileApi.saveAnswers([{ key: step.key, value }]).then(
      () => true,
      () => false,
    );

    let acknowledged = false;
    if (step.kind === "text") {
      try {
        const reply = await luminaApi.chat({ text: value, clientMessageId: crypto.randomUUID() });
        // Support wording (crisis) is shown whole; an ordinary reply becomes an acknowledgement.
        const text = reply.support.level === "CRISIS" ? reply.reply : acknowledgement(reply.reply, copy.onboarding.ack);
        setLines((current) => [...current, { id: `r:${step.key}`, role: "lumina", text, createdAt: new Date().toISOString() }]);
        acknowledged = true;
        if (reply.support.level === "CRISIS") {
          setCrisis(reply.support.emergencyResources ?? []);
          setBusy(false);
          setSaveFailed(!(await saving));
          return; // pause: support comes before the next question
        }
      } catch {
        /* Lumina unavailable: the answer is still saved and the flow continues */
      }
    }
    if (!(await saving)) setSaveFailed(true);
    setBusy(false);
    if (acknowledged) await new Promise((resolve) => window.setTimeout(resolve, 900));
    advance();
  }

  if (done) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-5 py-16 text-center">
        <LuminaLogo size={112} float presence />
        <h1 className="text-2xl font-semibold text-ink">{copy.onboarding.finishTitle}</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">{copy.onboarding.finishBody}</p>
        <Button size="lg" onClick={() => void leave()} disabled={busy}>
          {copy.onboarding.finishCta}<ArrowRight className="rtl:-scale-x-100" aria-hidden />
        </Button>
      </div>
    );
  }

  const multi = step?.kind === "multi";
  const options = stepCopy?.options ?? [];

  return (
    <div className="lm-rise flex h-[calc(100dvh-12.5rem)] min-h-[34rem] flex-col lg:h-[calc(100dvh-7.75rem)]">
      <PageIntro
        className="mb-4"
        eyebrow={copy.shell.eyebrows.lumina}
        icon={Sparkles}
        title={copy.onboarding.title}
        subtitle={copy.onboarding.subtitle}
        action={
          <>
            <span className="chip tabular-nums">{fill(copy.onboarding.progress, { a: Math.min(index + 1, steps.length), b: steps.length })}</span>
            <Button variant="outline" size="sm" onClick={() => void leave()} disabled={busy}>{copy.onboarding.skipAll}</Button>
          </>
        }
      />
    <section aria-label={copy.onboarding.title} className="lm-sanctuary flex min-h-0 flex-1 flex-col">
      <LuminaMotes />
      <div className="h-1 bg-ink/5" aria-hidden>
        <motion.div className="h-full bg-gradient-to-r from-teal-400 to-teal-700 rtl:bg-gradient-to-l" animate={{ width: `${(index / steps.length) * 100}%` }} transition={{ duration: 0.5 }} />
      </div>

      <div role="log" aria-live="polite" className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto w-full max-w-3xl space-y-5">
        {lines.map((line, index) => (
          <LuminaMessage key={line.id} message={line} index={index} plain />
        ))}
        <AnimatePresence>{(typing || busy) && !crisis && <TypingRow key="typing" />}</AnimatePresence>
        {saveFailed && <p className="text-center text-xs text-gold-700">{copy.onboarding.savingFail}</p>}
        <div ref={bottom} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {crisis ? (
          <motion.div key="crisis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="alert" className="border-t border-rose-100 bg-rose-50/90 px-4 py-4 sm:px-[max(1.5rem,calc((100%-48rem)/2))]">
            <div className="flex items-start gap-3 text-sm text-rose-700">
              <ShieldAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{copy.chat.crisisTitle}</p>
                <p className="mt-0.5">{copy.chat.crisisBody}</p>
                {crisis.length > 0 && <ul className="mt-1.5 list-inside list-disc" dir="auto">{crisis.map((item) => <li key={item}>{item}</li>)}</ul>}
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button variant="outline" onClick={() => { setCrisis(null); advance(); }}>{copy.common.next}</Button>
            </div>
          </motion.div>
        ) : step && !typing && stepCopy ? (
          <motion.div key={step.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="border-t border-white/70 bg-white/55 px-4 py-4 sm:px-[max(1.5rem,calc((100%-48rem)/2))]">
            {step.kind === "name" && !nameMode && (
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => void answer(name, fill(copy.onboarding.useNickname, { name }))} disabled={busy}><Check aria-hidden />{fill(copy.onboarding.useNickname, { name })}</Button>
                <Button variant="outline" onClick={() => setNameMode(true)} disabled={busy}>{copy.onboarding.another}</Button>
              </div>
            )}

            {((step.kind === "name" && nameMode) || step.kind === "text") && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (draft.trim()) void answer(draft.trim());
                }}
                className="space-y-2"
              >
                <div className="flex items-end gap-2 rounded-3xl border border-white/80 bg-white/90 p-2 ps-4 focus-within:border-teal-400">
                  <textarea
                    autoFocus
                    rows={step.kind === "name" ? 1 : 2}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                        event.preventDefault();
                        if (draft.trim()) void answer(draft.trim());
                      }
                    }}
                    maxLength={step.kind === "name" ? 30 : 300}
                    dir="auto"
                    placeholder={step.kind === "name" ? copy.onboarding.namePlaceholder : stepCopy.placeholder ?? copy.onboarding.type}
                    aria-label={copy.onboarding.type}
                    className="max-h-32 min-h-10 flex-1 resize-none bg-transparent py-2 text-[0.9375rem] text-ink outline-none placeholder:text-muted-foreground"
                  />
                  <Button type="submit" size="icon" aria-label={copy.onboarding.send} disabled={!draft.trim() || busy}>
                    {busy ? <LogoSpinner size={18} /> : <Send className="rtl:-scale-x-100" aria-hidden />}
                  </Button>
                </div>
                {step.kind === "text" && <button type="button" onClick={advance} disabled={busy} className="text-xs font-medium text-muted-foreground hover:text-ink hover:underline">{copy.onboarding.skipOne}</button>}
              </form>
            )}

            {(step.kind === "single" || multi) && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2" role={multi ? "group" : "radiogroup"}>
                  {options.map((option) => {
                    const active = selected.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        role={multi ? "checkbox" : "radio"}
                        aria-checked={active}
                        disabled={busy}
                        onClick={() => (multi ? setSelected((current) => (active ? current.filter((item) => item !== option) : [...current, option])) : void answer(option))}
                        className={cn(
                          "rounded-full border px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500",
                          active ? "border-transparent bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-brand" : "border-teal-200 bg-white/80 text-teal-800 hover:-translate-y-0.5 hover:bg-white",
                        )}
                      >
                        {active && <Check className="me-1.5 inline size-3.5" aria-hidden />}{option}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button type="button" onClick={advance} disabled={busy} className="text-xs font-medium text-muted-foreground hover:text-ink hover:underline">{copy.onboarding.skipOne}</button>
                  {multi && (
                    <Button onClick={() => void answer(selected.join(", "))} disabled={!selected.length || busy}>
                      {copy.common.next}<ArrowRight className="rtl:-scale-x-100" aria-hidden />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
    </div>
  );
}
