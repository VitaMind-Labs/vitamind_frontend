"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import all components
import { ProgressBar, CustomCursor } from "@/components/_homeComponents/ProgressBar";
import { LoadingScreen } from "@/components/_homeComponents/LoadingScreen";
import { Navbar } from "@/components/_homeComponents/Navbar";
import { Hero } from "@/components/_homeComponents/Hero";
import { Features } from "@/components/_homeComponents/Features";
import { HowItWorks } from "@/components/_homeComponents/HowItWorks";
import { Pricing } from "@/components/_homeComponents/Pricing";
import { CTASection } from "@/components/_homeComponents/CTASection";
import { Footer } from "@/components/_homeComponents/Footer";
import { CinematicIntro } from "@/components/_homeComponents/CinematicIntro";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Phase = "loading" | "intro" | "main";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [isMobile, setIsMobile] = useState(false);
  const [initialPhaseLoaded, setInitialPhaseLoaded] = useState(false);
  const HOME_INTRO_STORAGE_KEY = "vitamind_home_intro_seen";

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const storedValue = localStorage.getItem(HOME_INTRO_STORAGE_KEY);
    const hasSeenIntro = storedValue === "1";

    if (!hasSeenIntro) {
      localStorage.setItem(HOME_INTRO_STORAGE_KEY, "1");
    }

    setPhase(hasSeenIntro ? "main" : "loading");
    setInitialPhaseLoaded(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = phase !== "main" ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [phase]);

  if (!initialPhaseLoaded) {
    return null;
  }

  return (
    <main className="relative min-h-screen bg-white text-gray-900 overflow-x-hidden font-sans selection:bg-[#e3b01c]/20 selection:text-[#2c3e3b]">
      <style jsx global>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient-shift 15s ease infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .text-gradient {
          background: linear-gradient(135deg, #2c3e3b 0%, #518591 40%, #e3b01c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {!isMobile && <CustomCursor />}

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
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-full"
          >
            <ProgressBar />
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <Pricing />
            <CTASection />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
