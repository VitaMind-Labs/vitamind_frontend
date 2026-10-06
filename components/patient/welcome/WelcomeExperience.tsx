"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { LuminaHero3D } from "@/components/patient/welcome/LuminaHero3D";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePatient } from "@/hooks/patient/usePatient";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import { profileApi } from "@/lib/api/patient";
import { fill } from "@/lib/i18n/patient";
import { markWelcomeSeen } from "@/lib/patient/onboarding";
import { canSpeak, speakWelcome, type SpeakHandle } from "@/lib/patient/voice";
import { EASE_OUT } from "@/lib/motion";

type Phase = "intro" | "playing" | "done";

/** How long a caption stays before the next one, from its length (reading/speaking pace). */
const holdFor = (text: string, arabic: boolean) => Math.max(1800, text.length * (arabic ? 78 : 64));
const REDIRECT_MS = 3200;

/**
 * The first thing a new patient sees after signing up: a 3D presence, a spoken welcome (with
 * captions, and a silent path) and a hand-off to the first check-in. No navigation, no dashboard
 * chrome — only a language switch and "skip".
 */
export function WelcomeExperience() {
  const copy = usePatientCopy();
  const w = copy.welcome;
  const router = useRouter();
  const reduce = useReducedMotion();
  const { language } = useLanguage();
  const { profile, name, refreshProfile } = usePatient();
  const [phase, setPhase] = useState<Phase>("intro");
  const [visible, setVisible] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [withSound, setWithSound] = useState(true);
  const voice = useRef<SpeakHandle | null>(null);
  const timers = useRef<number[]>([]);

  const lines = w.lines.map((line) => fill(line, { name }));
  const soundPossible = canSpeak();

  const clear = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  const stopVoice = useCallback(() => {
    voice.current?.cancel();
    voice.current = null;
    setSpeaking(false);
  }, []);

  const go = useCallback(() => {
    clear();
    stopVoice();
    markWelcomeSeen(profile.id);
    // The welcome is the whole onboarding now: finish it, then start with the first check-in.
    void (profile.hasCompletedOnboarding ? Promise.resolve() : profileApi.completeOnboarding().then(refreshProfile)).catch(() => undefined);
    router.replace(profile.hasCompletedOnboarding ? "/dashboard" : "/dashboard/check-in");
  }, [clear, stopVoice, profile.id, profile.hasCompletedOnboarding, refreshProfile, router]);

  useEffect(() => () => {
    clear();
    voice.current?.cancel();
  }, [clear]);

  const play = useCallback(
    (sound: boolean) => {
      clear();
      stopVoice();
      setWithSound(sound);
      setPhase("playing");
      setVisible(0);

      // Captions follow the speech pace whether or not it is audible.
      let at = 250;
      lines.forEach((line, index) => {
        timers.current.push(window.setTimeout(() => setVisible(index + 1), at));
        at += holdFor(line, language === "ar");
      });
      let captionsDone = false;
      let speechDone = !sound;
      const finish = () => captionsDone && speechDone && setPhase("done");
      timers.current.push(window.setTimeout(() => { captionsDone = true; finish(); }, at));

      if (sound) {
        void speakWelcome(fill(w.voiceText, { name }), language, {
          onStart: () => setSpeaking(true),
          onEnd: () => { setSpeaking(false); speechDone = true; finish(); },
          onError: () => { setSpeaking(false); speechDone = true; finish(); },
        }).then((handle) => {
          voice.current = handle;
          if (!handle) { speechDone = true; finish(); }
        });
      }
    },
    // The captions/voice text depend on the language and name at the moment of pressing play.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language, name, clear, stopVoice, w],
  );

  // Once the welcome is finished, hand over to the first check-in.
  useEffect(() => {
    if (phase !== "done") return;
    const timer = window.setTimeout(go, REDIRECT_MS);
    return () => window.clearTimeout(timer);
  }, [phase, go]);

  return (
    <div className="lm-canvas relative flex min-h-dvh flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[28%] size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--lm-g1),var(--lm-g4)_45%,transparent_70%)] blur-2xl" />

      <header className="relative z-10 flex items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <BrandLogo size="sm" href={null} />
        <div className="flex items-center gap-3">
          {phase === "intro" && <LanguageSwitcher />}
          <Button variant="ghost" size="sm" onClick={go}>{w.skip}</Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-6 pb-10 text-center">
        <motion.div
          className="h-[42vh] min-h-64 w-full max-w-md"
          animate={{ scale: phase === "intro" ? 1 : 1.04 }}
          transition={{ duration: reduce ? 0 : 1.2, ease: EASE_OUT }}
        >
          <LuminaHero3D speaking={speaking} />
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === "intro" ? (
            <motion.div key="intro" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.5, ease: EASE_OUT }} className="flex flex-col items-center gap-5">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{w.tap}</h1>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">{w.tapBody}</p>
              </div>
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                {soundPossible && (
                  <Button variant="hero" size="lg" onClick={() => play(true)}>
                    <Volume2 aria-hidden />{w.tap}
                  </Button>
                )}
                <Button variant={soundPossible ? "outline" : "hero"} size="lg" onClick={() => play(false)}>{w.noSound}</Button>
              </div>
              <p className="text-xs text-muted-foreground">{w.safe}</p>
            </motion.div>
          ) : (
            <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full flex-col items-center gap-6">
              <div aria-live="polite" className="min-h-[9.5rem] space-y-3">
                {lines.slice(0, visible).map((line, index) => (
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, y: 10, filter: reduce ? "none" : "blur(6px)" }}
                    animate={{ opacity: index === visible - 1 || phase === "done" ? 1 : 0.55, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.7, ease: EASE_OUT }}
                    className={index === 0 ? "text-2xl font-semibold text-ink sm:text-3xl" : "mx-auto max-w-md text-base leading-relaxed text-ink-soft sm:text-lg"}
                    dir="auto"
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              <div className="flex flex-col items-center gap-3">
                <Button variant="hero" size="lg" onClick={go} className="relative overflow-hidden">
                  {phase === "done" && !reduce && (
                    <motion.span aria-hidden className="absolute inset-y-0 start-0 bg-white/25" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: REDIRECT_MS / 1000, ease: "linear" }} />
                  )}
                  <span className="relative inline-flex items-center gap-2">{w.continue}<ArrowRight className="rtl:-scale-x-100" aria-hidden /></span>
                </Button>
                <div className="flex items-center gap-1">
                  {withSound && soundPossible && phase === "playing" && (
                    <Button variant="ghost" size="sm" onClick={() => { stopVoice(); setWithSound(false); }}>
                      <VolumeX aria-hidden />{w.mute}
                    </Button>
                  )}
                  {phase === "done" && soundPossible && (
                    <Button variant="ghost" size="sm" onClick={() => play(true)}><Volume2 aria-hidden />{w.replay}</Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
