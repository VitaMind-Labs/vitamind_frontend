"use client";

import { CinematicIntro, LoadingScreen, ProgressBar } from "@/components/home";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  CTASection,
  ConditionsSection,
  FeaturesSection,
  FooterSection,
  Header,
  HeroSection,
  PricingSection,
  ProcessSection,
  StatementSection,
} from "@/components/home";

type Phase = "loading" | "intro" | "main";

export default function Home() {
  const { direction } = useLanguage();
  const [phase, setPhase] = useState<Phase>("loading");
  const [initialPhaseLoaded, setInitialPhaseLoaded] = useState(false);
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
      className="home-page min-h-dvh w-full overflow-x-clip bg-white text-ink"
    >
      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <LoadingScreen key="loading" onComplete={() => setPhase("intro")} />
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
              <HeroSection />
              <StatementSection />
              <FeaturesSection />
              <ConditionsSection />
              <ProcessSection />
              <PricingSection />
              <CTASection />
              <FooterSection />
            </SmoothScrollProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
