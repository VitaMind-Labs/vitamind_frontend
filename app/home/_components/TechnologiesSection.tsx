"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    buttonTap,
    createStaggerContainer,
    createStaggerItem,
    getButtonHover,
    getCardHover,
    getRevealProps,
} from "../animations";

// ─── DONNÉES ──────────────────────────────────────────────────────────────────
const technologies = [
  {
    number: "01",
    title: "Hosting & Compliance",
    description:
      "Clinical-grade sovereign infrastructure built for modern mental healthcare. Fully compliant, privacy-first, and optimized for secure AI operations.",
    bullets: [
      "HIPAA & GDPR Ready",
      "Zero-Knowledge Protocol",
      "Encrypted Health Infrastructure",
    ],
  },
  {
    number: "02",
    title: "Privacy-First Architecture",
    description:
      "Advanced encryption layers and secure behavioral intelligence pipelines designed to preserve user trust and sensitive clinical interactions.",
    bullets: [
      "End-to-End Encryption",
      "Behavioral Signal Protection",
      "Anonymous AI Processing",
    ],
  },
  {
    number: "03",
    title: "Multilingual Intelligence",
    description:
      "Our AI understands Tunisian Derja, Arabic, French, and cultural nuances to deliver deeply contextual mental healthcare experiences.",
    bullets: [
      "Derja Native AI",
      "Cultural Understanding",
      "Real-Time Language Detection",
    ],
  },
];

// ─── VARIANTES D'ANIMATION ────────────────────────────────────────────────────
const panelVariants = {
  initial: { opacity: 0, y: 36, scale: 0.985, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: -18, scale: 0.99, filter: "blur(8px)" },
};

const bulletVariants = createStaggerItem({ x: 16, y: 0, blur: 6, duration: 0.5 });
const navVariants = createStaggerContainer({ delayChildren: 0.04, staggerChildren: 0.08 });

export default function TechnologiesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = technologies[activeIndex];

  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">

        {/* ── EN-TÊTE DE SECTION ── */}
        <motion.div
          {...getRevealProps({ y: 24, blur: 10, duration: 1 })}
          className="max-w-4xl mb-20"
        >
          {/* Label */}
          <span
            className="font-body text-[13px] font-semibold uppercase tracking-[0.28em]"
            style={{ color: "#C9A227" }}
          >
            Neural Infrastructure
          </span>

          {/* H2 — taille unifiée avec le reste de la page */}
          <h2
            className="
                            font-display
                            mt-5
                            text-[clamp(32px,4.5vw,60px)]
                            leading-[1.08]
                            tracking-[-0.025em]
                            font-light
                        "
            style={{ color: "#111827" }}
          >
            Built for the future of{" "}
            <span style={{ color: "#1D5C63" }}>
              AI-powered mental healthcare
            </span>
          </h2>
        </motion.div>

        {/* ── CORPS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* ── COLONNE GAUCHE — liste navigable ── */}
          <div className="lg:col-span-5">
            <motion.div
              variants={navVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-8"
            >
              {technologies.map((item, index) => {
                const isActive = activeIndex === index;
                return (
                  <motion.button
                    key={item.title}
                    variants={createStaggerItem({ y: 18, blur: 8, duration: 0.7 })}
                    onClick={() => setActiveIndex(index)}
                    whileHover={getCardHover(-4, 1.005)}
                    whileTap={buttonTap}
                    className="w-full rounded-[24px] p-5 text-left group focus-visible:outline-none"
                    aria-selected={isActive}
                    style={{
                      background: isActive ? "rgba(255,255,255,0.72)" : "transparent",
                      border: isActive
                        ? "1px solid rgba(81,133,145,0.12)"
                        : "1px solid transparent",
                      boxShadow: isActive
                        ? "0 16px 42px -24px rgba(81,133,145,0.24)"
                        : "none",
                      backdropFilter: isActive ? "blur(12px)" : undefined,
                    }}
                  >
                    <div className="flex items-start gap-6">
                      {/* Numéro */}
                      <span
                        className="
                                                    font-display
                                                    text-[clamp(28px,3vw,40px)]
                                                    font-light
                                                    transition-colors duration-400
                                                    leading-none mt-1
                                                "
                        style={{
                          color: isActive ? "#C9A227" : "#D1D5DB",
                        }}
                      >
                        {item.number}
                      </span>

                      {/* Titre + ligne */}
                      <div className="flex-1">
                        <h3
                          className="
                                                        font-display
                                                        text-[clamp(20px,2.2vw,30px)]
                                                        leading-tight
                                                        font-light
                                                        transition-colors duration-400
                                                    "
                          style={{
                            color: isActive ? "#111827" : "#9CA3AF",
                          }}
                        >
                          {item.title}
                        </h3>

                        {/* Ligne indicatrice */}
                        <div
                          className="mt-4 h-px transition-all duration-600"
                          style={{
                            width: isActive ? "100%" : "48px",
                            background: isActive
                              ? "#1D5C63"
                              : "#E5E7EB",
                          }}
                        />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          {/* ── COLONNE DROITE — panneau de détail ── */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[28px] border border-[rgba(81,133,145,0.10)] bg-white/70 p-8 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.18)] backdrop-blur-xl md:p-10"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, rgba(81,133,145,0.45), rgba(227,176,28,0.45), transparent)",
                  }}
                />
                {/* Numéro décoratif en arrière-plan */}
                <div
                  aria-hidden="true"
                  className="
                                        absolute -top-14 right-0
                                        font-display font-light
                                        leading-none select-none pointer-events-none
                                    "
                  style={{
                    fontSize: "clamp(120px, 16vw, 220px)",
                    color: "rgba(29,92,99,0.05)",
                  }}
                >
                  {active.number}
                </div>

                {/* Contenu */}
                <div className="relative z-10 max-w-3xl">
                  {/* Label sous-section */}
                  <span
                    className="font-body text-[13px] font-semibold uppercase tracking-[0.28em]"
                    style={{ color: "#C9A227" }}
                  >
                    AI Infrastructure
                  </span>

                  {/* Titre du panneau */}
                  <h3
                    className="
                                            font-display
                                            mt-6
                                            text-[clamp(28px,4vw,52px)]
                                            leading-[1.05]
                                            tracking-[-0.025em]
                                            font-light
                                        "
                    style={{ color: "#111827" }}
                  >
                    {active.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="font-body mt-8 max-w-2xl text-[17px] leading-[1.8] font-light"
                    style={{ color: "#4B5563" }}
                  >
                    {active.description}
                  </p>

                  {/* Bullets */}
                  <ul className="mt-10 space-y-5">
                    {active.bullets.map((bullet, idx) => (
                      <motion.li
                        key={bullet}
                        custom={idx}
                        variants={bulletVariants}
                        initial="initial"
                        animate="animate"
                        className="flex items-center gap-4"
                      >
                        <span
                          className="flex-shrink-0 w-2 h-2 rounded-full"
                          style={{ background: "#C9A227" }}
                        />
                        <span
                          className="font-body text-[16px]"
                          style={{ color: "#374151" }}
                        >
                          {bullet}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <motion.button
                    whileHover={getButtonHover()}
                    whileTap={buttonTap}
                    transition={{ duration: 0.25 }}
                    className="
                                            mt-14
                                            font-body
                                            px-8 py-[14px]
                                            rounded-full
                                            text-[14px] font-semibold tracking-wide
                                            text-white
                                            transition-colors duration-300
                                        "
                    style={{ background: "#111827" }}
                  >
                    Explore Infrastructure
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
