"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type CinematicIntroProps = {
  onComplete: () => void;
};

export const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const [startExit, setStartExit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStartExit(true), 4200);
    const completeTimer = setTimeout(() => onComplete(), 5000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Découpage du texte en mots individuels
  const line1Words = ["Understanding", "Human", "Emotion"];
  const line2Words = ["Through", "AI"];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-50 bg-white flex items-center justify-center overflow-hidden"
    >
      {/* Seul le cercle blur original */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.4, 0.8, 0], scale: [0.5, 2, 6, 25] }}
        transition={{ duration: 4.5, ease: "easeIn", times: [0, 0.3, 0.7, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vmax] h-[50vmax] bg-gradient-to-tr from-[#518591]/20 via-[#2c3e3b]/10 to-[#e3b01c]/20 rounded-full blur-[120px]"
      />

      {/* Conteneur principal avec animation scale */}
      <motion.div
        animate={{ scale: startExit ? 1.2 : 1, opacity: startExit ? 0 : 1 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <div className="text-center px-6 max-w-6xl">
          {/* Première ligne */}
          <div className="overflow-hidden mb-4 md:mb-6">
            <div className="flex flex-wrap justify-center gap-x-6 md:gap-x-8 lg:gap-x-12">
              {line1Words.map((word, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: 100, rotateX: -40 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.2 + idx * 0.12,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="inline-block font-display font-extralight text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-transparent bg-clip-text leading-[0.95] tracking-tighter"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #2c3e3b 0%, #518591 40%, #e3b01c 100%)",
                    WebkitBackgroundClip: "text",
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Deuxième ligne */}
          <div className="overflow-hidden">
            <div className="flex flex-wrap justify-center gap-x-6 md:gap-x-8 lg:gap-x-12">
              {line2Words.map((word, idx) => (
                <motion.span
                  key={idx + 3}
                  initial={{ opacity: 0, y: 100, rotateX: -40 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.65 + idx * 0.12,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="inline-block font-display font-extralight text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-transparent bg-clip-text leading-[0.95] tracking-tighter"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #2c3e3b 0%, #518591 40%, #e3b01c 100%)",
                    WebkitBackgroundClip: "text",
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Ligne décorative */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1, ease: [0.76, 0, 0.24, 1] }}
            className="h-px bg-gradient-to-r from-transparent via-[#518591] to-transparent mt-8 mx-auto"
            style={{ width: "clamp(100px, 30vw, 200px)" }}
          />

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="text-gray-400 text-xs uppercase tracking-[0.3em] mt-6 font-light"
          >
            Redefining Emotional Intelligence
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};