"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
    Target,
    Users,
    Brain,
    MapPin,
    Sparkles,
    ArrowRight,
    Heart,
    Shield,
} from "lucide-react";
import {
    buttonTap,
    createStaggerContainer,
    createStaggerItem,
    getButtonHover,
    getCardHover,
    getRevealProps,
    pulseDot,
    pulseDotTransition,
    useSectionInView,
} from "../animations";

// ─── DONNÉES ──────────────────────────────────────────────────────────────────
const focusItems = [
  {
    icon: Users,
    title: "Population focus",
    description:
      "Adults aged 18–45 who are experiencing persistent symptoms they cannot name, are on psychiatric waiting lists, or want structured, data-backed context before consultation.",
    accentColor: "hsl(45,93%,47%)",
    stat: "18–45",
    statLabel: "Age range",
  },
  {
    icon: Brain,
    title: "Clinical conditions",
    description:
      "ADHD, bipolar, psychosis spectrum and depression supported by validated questionnaires, behavioral intelligence and adaptive therapeutic responses.",
    accentColor: "hsl(187,27%,40%)",
    stat: "6+",
    statLabel: "Conditions",
  },
  {
    icon: MapPin,
    title: "Geographic markets",
    description:
      "Phase 1: Tunisia and France. Phase 2: Morocco, Algeria, Belgium and Switzerland with Arabic and Francophone mental-health infrastructure.",
    accentColor: "hsl(45,93%,47%)",
    stat: "6",
    statLabel: "Countries",
  },
];

// ─── COMPTEUR ANIMÉ ───────────────────────────────────────────────────────────
function AnimatedStat({
  value,
  label,
  isInView,
}: {
  value: string;
  label: string;
  isInView: boolean;
}) {
  const [display, setDisplay] = useState("0");
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/[0-9.]/g, "");
  const resolvedDisplay = isNaN(numeric) ? value : display;

  useEffect(() => {
    if (!isInView) return;

    if (isNaN(numeric)) {
      return;
    }

    const duration = 1600;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * numeric);

      setDisplay(
        numeric % 1 !== 0
          ? (eased * numeric).toFixed(1) + suffix
          : current.toLocaleString() + suffix
      );

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, numeric, suffix]);

  return (
    <div>
      {/*
                CORRECTION :
                - font-neo-grotesque → font-display
                - taille alignée avec les stats des autres sections
            */}
      <div
        className="font-display font-light tracking-[-0.04em]"
        style={{ fontSize: "clamp(28px, 3vw, 38px)", color: "hsl(187,27%,40%)" }}
      >
        {resolvedDisplay}
      </div>
      <div
        className="font-body text-[11px] uppercase tracking-[0.16em] mt-1"
        style={{ color: "rgba(81,133,145,0.55)" }}
      >
        {label}
      </div>
    </div>
  );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function FocusSection() {
  const { ref: sectionRef, isInView } = useSectionInView<HTMLElement>(0.15);
  const containerVariants = createStaggerContainer({ delayChildren: 0.08, staggerChildren: 0.12 });
  const itemVariants = createStaggerItem({ y: 28, blur: 8, duration: 0.76 });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-4 py-24 md:px-8 lg:px-10 lg:py-32"
    >
      {/* ── HALO D'AMBIANCE ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-[15%] top-0 h-[70vh] w-[70vh] rounded-full blur-3xl"
          style={{ background: "rgba(81,133,145,0.05)" }}
        />
        <div
          className="absolute -right-[15%] bottom-0 h-[70vh] w-[70vh] rounded-full blur-3xl"
          style={{ background: "rgba(201,162,39,0.05)" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">

        {/* ── EN-TÊTE ── */}
        <motion.div
          {...getRevealProps({ y: 24, blur: 10, duration: 0.95 })}
          className="mb-20 text-center"
        >
          {/* Badge label */}
          <div
            className="inline-flex items-center gap-3 rounded-full px-5 py-2.5"
            style={{
              border: "1px solid rgba(81,133,145,0.12)",
              background: "rgba(255,255,255,0.70)",
              backdropFilter: "blur(16px)",
            }}
          >
            <motion.span
              animate={pulseDot}
              transition={pulseDotTransition}
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{ background: "hsl(45,93%,47%)" }}
            />
            {/* CORRECTION : font-body */}
            <span
              className="font-body text-[11px] font-semibold uppercase tracking-[0.30em]"
              style={{ color: "hsl(187,27%,40%)" }}
            >
              Who We Serve
            </span>
          </div>

          {/*
                        CORRECTION :
                        - font-neo-grotesque → font-display
                        - taille : text-5xl/6xl/7xl hardcodé → clamp cohérent avec le reste
                    */}
          <h2
            className="font-display font-light tracking-[-0.03em] mt-8"
            style={{
              fontSize: "clamp(32px, 4.5vw, 60px)",
              lineHeight: 1.08,
              color: "hsl(187,27%,40%)",
            }}
          >
            Our Focus{" "}
            <span
              style={{
                backgroundImage:
                  "linear-gradient(135deg, hsl(187,27%,40%), hsl(160,18%,22%), hsl(45,93%,47%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Areas
            </span>
          </h2>

          {/* CORRECTION : font-body, taille unifiée */}
          <p
            className="mx-auto mt-5 max-w-xl font-body text-[16px] leading-[1.72]"
            style={{ color: "rgba(15,23,42,0.65)" }}
          >
            We build accessible and culturally-aware mental healthcare
            experiences designed for underserved populations.
          </p>
        </motion.div>

        {/* ── GRILLE PRINCIPALE ── */}
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">

          {/* ── GAUCHE — message principal ── */}
          <motion.div
            {...getRevealProps({ delay: 0.12, x: -24, y: 0, blur: 8, duration: 0.95 })}
            className="relative"
          >
            <div className="sticky top-24">
              {/* Mini label */}
              <div className="mb-7 inline-flex items-center gap-3">
                <Target
                  className="h-4 w-4 flex-shrink-0"
                  style={{ color: "hsl(45,93%,47%)" }}
                />
                {/* CORRECTION : font-body */}
                <span
                  className="font-body text-[11px] font-semibold uppercase tracking-[0.28em]"
                  style={{ color: "rgba(81,133,145,0.60)" }}
                >
                  Primary Mission
                </span>
              </div>

              {/* Déclaration principale */}
              <div className="relative">
                <div
                  className="absolute -left-5 top-1 h-32 w-[2px] rounded-full"
                  style={{
                    background:
                      "linear-gradient(to bottom, hsl(45,93%,47%), hsl(187,27%,40%))",
                  }}
                />
                {/*
                                    CORRECTION :
                                    - font-neo-grotesque → font-display
                                    - text-4xl/5xl/6xl → clamp, taille entre H2 et H4
                                      (c'est une citation/statement, pas un H2 de section)
                                */}
                <h3
                  className="pl-8 font-display font-light leading-[1.08] tracking-[-0.03em]"
                  style={{
                    fontSize: "clamp(26px, 3.2vw, 42px)",
                    color: "hsl(187,27%,40%)",
                  }}
                >
                  People struggling without a structured and culturally
                  appropriate way to understand emotional distress.
                </h3>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={getButtonHover()}
                whileTap={buttonTap}
                className="group mt-10 inline-flex items-center gap-3 rounded-full px-8 py-[14px] text-white"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(187,27%,40%), hsl(45,93%,47%))",
                  boxShadow: "0 16px 50px -16px rgba(0,0,0,0.20)",
                  transition: "box-shadow 0.3s ease",
                }}
              >
                {/* CORRECTION : font-body */}
                <span className="font-body text-[14px] font-semibold tracking-[0.01em]">
                  Learn more about our mission
                </span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>

              {/* ── STATS avec compteurs animés ── */}
              <div className="mt-12 flex flex-wrap gap-9">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full flex-shrink-0"
                    style={{ background: "rgba(201,162,39,0.10)" }}
                  >
                    <Heart
                      className="h-5 w-5"
                      style={{ color: "hsl(45,93%,47%)" }}
                    />
                  </div>
                  {/* CORRECTION : AnimatedStat remplace le texte statique */}
                  <AnimatedStat
                    value="100000+"
                    label="Users supported"
                    isInView={isInView}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full flex-shrink-0"
                    style={{ background: "rgba(201,162,39,0.10)" }}
                  >
                    <Shield
                      className="h-5 w-5"
                      style={{ color: "hsl(45,93%,47%)" }}
                    />
                  </div>
                  <AnimatedStat
                    value="99.9%"
                    label="Data security"
                    isInView={isInView}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── DROITE — cartes focus ── */}
          {/*
                        CORRECTION PRINCIPALE :
                        - variants={itemVariants} était commenté → décommenté
                        - containerVariants déclenché par isInView
                    */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-5"
          >
            {focusItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}   // ← DÉCOMMENTÉ
                  whileHover={getCardHover(-2, 1.006)}
                  className="group relative overflow-hidden transition-all duration-400"
                  style={{
                    /*
                        CORRECTION : rounded-[30px] → 20px
                        Cohérent avec ApproachSection et WorkflowSection
                    */
                    borderRadius: "20px",
                    border: "1px solid rgba(81,133,145,0.10)",
                    background: "rgba(255,255,255,0.78)",
                    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.07)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  {/* Halo hover */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(81,133,145,0.03), transparent)",
                      borderRadius: "inherit",
                    }}
                  />

                  <div className="relative p-7 lg:p-8">
                    {/* TOP */}
                    <div className="mb-6 flex items-start justify-between">
                      <div className="flex gap-5 items-start">
                        {/* Icône */}
                        <motion.div
                          whileHover={{ scale: 1.07, rotate: 3 }}
                          className="flex h-13 w-13 flex-shrink-0 items-center justify-center"
                          style={{
                            borderRadius: "14px",
                            width: "52px",
                            height: "52px",
                            background:
                              "linear-gradient(135deg, rgba(81,133,145,0.10), rgba(201,162,39,0.10))",
                          }}
                        >
                          <Icon
                            className="h-6 w-6"
                            style={{ color: item.accentColor }}
                          />
                        </motion.div>

                        <div>
                          {/*
                                                        CORRECTION :
                                                        - font-neo-grotesque → font-display
                                                        - text-3xl → clamp(18px, 2vw, 24px)
                                                          (titre de carte = H4, pas H2)
                                                    */}
                          <h4
                            className="font-display font-medium leading-tight tracking-[-0.02em]"
                            style={{
                              fontSize: "clamp(18px, 1.8vw, 22px)",
                              color: "hsl(187,27%,40%)",
                            }}
                          >
                            {item.title}
                          </h4>

                          <div className="mt-2.5 flex items-center gap-3">
                            <div
                              className="h-[3px] w-9 rounded-full"
                              style={{ background: item.accentColor }}
                            />
                            {/* CORRECTION : font-body */}
                            <span
                              className="font-body text-[11px] font-medium uppercase tracking-[0.20em]"
                              style={{ color: "rgba(81,133,145,0.52)" }}
                            >
                              {item.statLabel}: {item.stat}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Sparkles
                        className="h-4 w-4 flex-shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{ color: "rgba(201,162,39,0.50)" }}
                      />
                    </div>

                    {/* Description — CORRECTION : font-body */}
                    <p
                      className="font-body text-[15px] leading-[1.78]"
                      style={{ color: "rgba(15,23,42,0.65)" }}
                    >
                      {item.description}
                    </p>

                    {/* Footer hover */}
                    <div
                      className="mt-7 flex items-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100"
                    >
                      {/* CORRECTION : font-body */}
                      <span
                        className="font-body text-[11px] font-semibold uppercase tracking-[0.18em]"
                        style={{ color: "rgba(81,133,145,0.50)" }}
                      >
                        Explore {item.title.toLowerCase()}
                      </span>
                      <ArrowRight
                        className="h-3 w-3"
                        style={{ color: "rgba(81,133,145,0.50)" }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
