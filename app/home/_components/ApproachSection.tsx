"use client";

import { motion } from "framer-motion";
import { Shield, Sparkles, Heart, Brain } from "lucide-react";
import {
    createStaggerContainer,
    createStaggerItem,
    getCardHover,
    getIconHover,
    getRevealProps,
    pulseDot,
    pulseDotTransition,
    useSectionInView,
} from "../animations";

// ─── DONNÉES ──────────────────────────────────────────────────────────────────
const cards = [
    {
        title: "How we design — zero-stigma UX",
        subtitle: "Clinical integrity, human warmth",
        icon: Heart,
        dark: true,
        description:
            "The interface feels like a supportive companion, not medical software: no diagnostic language until the user opts in, a single call-to-action, and adaptive chromatherapy that reduces stigma.",
        gradient: "linear-gradient(to right, hsl(187,27%,40%), hsl(45,93%,47%))",
    },
    {
        title: "How we detect — behavioral intelligence",
        subtitle: "Digital phenotyping",
        icon: Brain,
        dark: false,
        description:
            "We analyze typing, scrolling, mouse movement and NLP against each user's baseline to deliver precise triage without relying on population averages.",
        gradient: "linear-gradient(to right, hsl(45,93%,47%), hsl(187,27%,40%))",
    },
    {
        title: "How we protect — safety by design",
        subtitle: "Compliance first",
        icon: Shield,
        dark: false,
        description:
            "RGPD-compliant, encrypted journaling and audit-grade escalation ensure user safety while preserving privacy and clinical accountability.",
        gradient: "linear-gradient(to right, hsl(187,27%,40%), hsl(45,93%,47%))",
    },
];

export default function ApproachSection() {
    const { ref: sectionRef, isInView } = useSectionInView<HTMLElement>(0.15);
    const containerVariants = createStaggerContainer({ delayChildren: 0.08, staggerChildren: 0.12 });
    const itemVariants = createStaggerItem({ y: 34, blur: 9, duration: 0.78 });

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden px-4 py-24 md:px-8 lg:px-10 lg:py-32"
        >
            {/* ── HALO D'AMBIANCE ── */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div
                    className="absolute -left-[20%] top-0 h-[80vh] w-[80vh] rounded-full blur-3xl"
                    style={{ background: "hsl(187,27%,40%,0.05)" }}
                />
                <div
                    className="absolute -right-[20%] bottom-0 h-[80vh] w-[80vh] rounded-full blur-3xl"
                    style={{ background: "hsl(45,93%,47%,0.05)" }}
                />
            </div>

            <div className="relative mx-auto max-w-7xl">

                {/* ── LABEL SECTION ── */}
                <motion.div
                    {...getRevealProps({ y: 22, blur: 8, duration: 0.95 })}
                    className="mb-12 flex justify-center lg:justify-start"
                >
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
                        {/* CORRECTION : font-body au lieu de font-sans */}
                        <span
                            className="font-body text-[11px] font-semibold uppercase tracking-[0.30em]"
                            style={{ color: "hsl(187,27%,40%)" }}
                        >
                            Our Approach
                        </span>
                    </div>
                </motion.div>

                {/* ── HEADER — titre + texte ── */}
                <motion.div
                    {...getRevealProps({ delay: 0.08, y: 28, blur: 10, duration: 1 })}
                    // {/* CORRECTION : mb-24 → mb-16 pour rythme cohérent */}
                    className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2"
                >
                    {/* Gauche — grand titre */}
                    <div className="max-w-2xl">
                        {/*
                            CORRECTION :
                            - font-neo-grotesque → font-display
                            - taille alignée avec les autres H2 : clamp(32px, 4.5vw, 60px)
                            - leading ajusté (0.92 → 1.02) : les retours à la ligne forcés
                              dans le JSX disparaissent au responsive, mieux de laisser
                              le flow naturel du texte
                        */}
                        <h2
                            className="font-display font-light tracking-[-0.035em]"
                            style={{
                                fontSize: "clamp(42px, 6vw, 80px)",
                                lineHeight: 1.0,
                                color: "hsl(187,27%,40%)",
                            }}
                        >
                            Hear.{" "}Decode.{" "}
                            <span
                                style={{
                                    backgroundImage:
                                        "linear-gradient(135deg, hsl(187,27%,40%), hsl(160,18%,22%), hsl(45,93%,47%))",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                Guide.
                            </span>
                        </h2>
                    </div>

                    {/* Droite — description */}
                    <div className="flex items-end">
                        <div className="relative max-w-xl">
                            {/* Barre décorative verticale */}
                            <div
                                className="absolute -left-5 top-1 h-24 w-[2px] rounded-full"
                                style={{
                                    background:
                                        "linear-gradient(to bottom, hsl(45,93%,47%), hsl(187,27%,40%))",
                                }}
                            />
                            {/* CORRECTION : font-body, taille unifiée text-body */}
                            <p
                                className="pl-8 font-body text-[16px] leading-[1.75]"
                                style={{ color: "rgba(15,23,42,0.68)" }}
                            >
                                It does not replace licensed psychiatric care. Instead,
                                it helps people identify symptoms, prepare for
                                consultation, and live better between appointments.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* ── GRILLE DE CARTES ── */}
                {/*
                    CORRECTION PRINCIPALE :
                    - variants={itemVariants} était commenté → décommenté
                    - containerVariants appliqué au wrapper
                    - isInView contrôle l'animation
                */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {cards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.title}
                                variants={itemVariants}   // ← DÉCOMMENTÉ
                                whileHover={getCardHover()}
                                className="group relative overflow-hidden transition-all duration-400"
                                style={{
                                    /*
                                        CORRECTION : rounded-[34px] → 20px
                                        Cohérent avec WorkflowSection et TechnologiesSection
                                    */
                                    borderRadius: "20px",
                                    ...(card.dark
                                        ? {
                                            background:
                                                "linear-gradient(135deg, hsl(187,27%,40%) 0%, hsl(187,27%,36%) 50%, hsl(45,93%,47%) 100%)",
                                            color: "white",
                                            boxShadow:
                                                "0 24px 60px -16px rgba(0,0,0,0.20)",
                                        }
                                        : {
                                            background: "rgba(255,255,255,0.82)",
                                            border: "1px solid rgba(81,133,145,0.10)",
                                            boxShadow:
                                                "0 8px 40px -12px rgba(0,0,0,0.07)",
                                            backdropFilter: "blur(16px)",
                                        }),
                                }}
                            >
                                {/* Lueur au hover */}
                                <div
                                    className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100 pointer-events-none"
                                    style={{
                                        background: card.dark
                                            ? "linear-gradient(to top, rgba(255,255,255,0.08), transparent)"
                                            : "linear-gradient(to top, rgba(227,176,28,0.04), transparent)",
                                        borderRadius: "inherit",
                                    }}
                                />
                                <div
                                    className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                    style={{
                                        boxShadow: card.dark
                                            ? "inset 0 0 0 1px rgba(255,255,255,0.14)"
                                            : "inset 0 0 0 1px rgba(81,133,145,0.16)",
                                    }}
                                />

                                {/* Orbe décoratif coin */}
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full blur-3xl"
                                    style={{ background: "rgba(227,176,28,0.08)" }}
                                />

                                {/* ── CONTENU ── */}
                                <div className="relative flex h-full flex-col p-8 lg:p-9">

                                    {/* Icône */}
                                    <motion.div
                                        whileHover={getIconHover()}
                                        className="mb-7 flex h-14 w-14 items-center justify-center"
                                        style={{
                                            borderRadius: "14px",
                                            background: card.dark
                                                ? "rgba(255,255,255,0.14)"
                                                : "linear-gradient(135deg, rgba(227,176,28,0.10), rgba(81,133,145,0.10))",
                                        }}
                                    >
                                        <Icon
                                            className="h-7 w-7"
                                            style={{
                                                color: card.dark ? "white" : "hsl(45,93%,47%)",
                                            }}
                                        />
                                    </motion.div>

                                    {/* Texte */}
                                    <div className="flex flex-1 flex-col">
                                        {/* Label sous-titre — CORRECTION : font-body */}
                                        <span
                                            className="font-body text-[11px] font-semibold uppercase tracking-[0.24em]"
                                            style={{
                                                color: card.dark
                                                    ? "rgba(255,255,255,0.52)"
                                                    : "rgba(81,133,145,0.60)",
                                            }}
                                        >
                                            {card.subtitle}
                                        </span>

                                        {/*
                                            CORRECTION :
                                            - font-neo-grotesque → font-display
                                            - text-3xl → text-[clamp(20px,2vw,26px)]
                                              (les titres de cartes doivent être H4,
                                               pas aussi grands que les H2 de section)
                                        */}
                                        <h3
                                            className="font-display font-light leading-[1.15] tracking-[-0.025em] mt-4"
                                            style={{
                                                fontSize: "clamp(18px, 1.8vw, 24px)",
                                                color: card.dark
                                                    ? "white"
                                                    : "hsl(187,27%,40%)",
                                            }}
                                        >
                                            {card.title}
                                        </h3>

                                        {/* Description — CORRECTION : font-body */}
                                        <p
                                            className="mt-5 font-body text-[15px] leading-[1.80] flex-1"
                                            style={{
                                                color: card.dark
                                                    ? "rgba(255,255,255,0.74)"
                                                    : "rgba(15,23,42,0.68)",
                                            }}
                                        >
                                            {card.description}
                                        </p>

                                        {/* Footer */}
                                        <div
                                            className="mt-8 flex items-center gap-2 pt-5"
                                            style={{
                                                borderTop: card.dark
                                                    ? "1px solid rgba(255,255,255,0.10)"
                                                    : "1px solid rgba(0,0,0,0.05)",
                                            }}
                                        >
                                            <div
                                                className="flex items-center gap-2 font-body text-[11px] font-medium uppercase tracking-[0.18em] opacity-55"
                                            >
                                                <Sparkles className="h-3.5 w-3.5" />
                                                <span>Learn more →</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Barre de progression bas — apparaît au hover */}
                                <div
                                    className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                                    style={{ background: card.gradient }}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
