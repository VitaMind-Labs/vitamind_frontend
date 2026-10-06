"use client";

import { CinematicIntro, LoadingScreen, ProgressBar } from "@/components/home";
import { SectionRail } from "@/components/home/SectionRail";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLanguageTransition } from "@/hooks/useLanguageTransition";
import { homeSerif } from "@/components/home/fonts";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Bridge, CareLoop, CTASection, FooterSection, Header, HealthcareSection, HeroSection } from "@/components/home";

type Phase = "loading" | "intro" | "main";

export default function Home() {
  const { direction } = useLanguage();
  const [phase, setPhase] = useState<Phase>("loading");
  const [initialPhaseLoaded, setInitialPhaseLoaded] = useState(false);
  // Content re-settles on language change; the fixed header and progress bar stay outside it.
  const contentRef = useLanguageTransition<HTMLDivElement>();
  const HOME_INTRO_STORAGE_KEY = "mindsens_home_intro_seen";

  useEffect(() => {
    let cancelled = false;
    const initializePhase = () => {
      const hasSeenIntro = localStorage.getItem(HOME_INTRO_STORAGE_KEY) === "1";

      if (!hasSeenIntro) {
        localStorage.setItem(HOME_INTRO_STORAGE_KEY, "1");
      }

      if (!cancelled) {
        setPhase(hasSeenIntro ? "main" : "loading");
        setInitialPhaseLoaded(true);
      }
    };

    const timer = window.setTimeout(initializePhase, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = phase === "main" ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [phase]);

  if (!initialPhaseLoaded) return null;

  return (
    <main
      dir={direction}
      className={cn(homeSerif.variable, "home-page min-h-dvh w-full overflow-x-clip bg-white text-ink selection:bg-teal-200 selection:text-ink")}
    >
      <AnimatePresence>
        {phase === "loading" && (
          <LoadingScreen key="loading" onComplete={() => setPhase("intro")} onSkip={() => setPhase("main")} />
        )}
        {phase === "intro" && (
          <CinematicIntro key="intro" onComplete={() => setPhase("main")} />
        )}
        {phase === "main" && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full"
          >
            <SmoothScrollProvider>
              <ProgressBar />
              <Header />
              <SectionRail />
              <div ref={contentRef}>
                <HeroSection />
                <Bridge />
                <CareLoop />
                <HealthcareSection />
                <CTASection />
                <FooterSection />
              </div>
            </SmoothScrollProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
