"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
    ambientFloat,
    ambientFloatTransition,
    buttonTap,
    getButtonHover,
    getRevealProps,
    shimmerSweep,
    shimmerSweepTransition,
} from "../animations";

// ─── DONNÉES ──────────────────────────────────────────────────────────────────
const PLANS = {
    essentielle: {
        name: "Essentielle",
        price: "19,99",
        currency: "TND",
        billing: "17,99 TND per month, paid annually",
        popular: false,
        features: [
            "Up to 30 chats / month",
            "1 agent",
            "Real-Time visitor tracking",
            "Analytics dashboard",
            "Widget translation",
            "Email support",
            "Standard response time",
        ],
    },
    pro: {
        name: "Pro",
        price: "49,99",
        currency: "TND",
        billing: "44,99 TND per month, paid annually",
        popular: true,
        features: [
            "Up to 100 chats / month",
            "5 agents",
            "Real-Time visitor tracking",
            "Advanced analytics",
            "Priority support",
            "Custom AI workflows",
            "Widget translation",
            "API access",
        ],
    },
} as const;

type PlanKey = keyof typeof PLANS;

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function PricingSection() {
    const [active, setActive] = useState<PlanKey>("pro");
    const plan = PLANS[active];

    return (
        <section className="relative overflow-hidden py-24 md:py-32">

            {/* ── HALO D'AMBIANCE ── */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div
                    className="absolute left-1/2 top-[20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full blur-3xl"
                    style={{ background: "rgba(81,133,145,0.05)" }}
                />
                <motion.div
                    animate={ambientFloat}
                    transition={{ ...ambientFloatTransition, duration: 17 }}
                    className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full blur-3xl"
                    style={{ background: "rgba(227,176,28,0.05)" }}
                />
            </div>

            <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 md:px-10 lg:px-16">

                {/* ── EN-TÊTE ── */}
                <motion.div
                    {...getRevealProps({ y: 22, blur: 10, duration: 0.95 })}
                    className="mb-14 text-center"
                >
                    {/* Label — CORRECTION : font-body */}
                    <span
                        className="font-body text-[12px] font-semibold uppercase tracking-[0.32em]"
                        style={{ color: "hsl(187,27%,40%)" }}
                    >
                        Pricing Experience
                    </span>

                    {/*
                        CORRECTION :
                        - h1 → h2 (pas de H1 en dehors du hero)
                        - font-neo-grotesque → font-display
                        - text-5xl/6xl/7xl hardcodé → clamp cohérent avec toutes les sections
                        - leading-[0.95] → 1.08 (plus lisible sur 2 lignes)
                    */}
                    <h2
                        className="font-display font-light tracking-[-0.03em] mt-5"
                        style={{
                            fontSize: "clamp(32px, 4.5vw, 60px)",
                            lineHeight: 1.08,
                            color: "#0f172a",
                        }}
                    >
                        Accessible{" "}
                        <span
                            style={{
                                backgroundImage:
                                    "linear-gradient(135deg, #518591, #2c3e3b, #e3b01c)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Mental Care.
                        </span>
                    </h2>

                    {/* CORRECTION : font-body */}
                    <p
                        className="mx-auto mt-6 max-w-xl font-body text-[16px] leading-[1.72]"
                        style={{ color: "#4B5563" }}
                    >
                        Flexible plans designed to support AI-powered mental healthcare,
                        emotional guidance, and accessible well-being experiences.
                    </p>
                </motion.div>

                {/* ── TOGGLE ── */}
                <motion.div
                    {...getRevealProps({ delay: 0.12, y: 16, blur: 8, duration: 0.8 })}
                    className="mb-16 flex items-center p-1.5"
                    style={{
                        borderRadius: "999px",
                        border: "1px solid rgba(81,133,145,0.12)",
                        background: "rgba(255,255,255,0.75)",
                        backdropFilter: "blur(16px)",
                    }}
                >
                    {(["essentielle", "pro"] as const).map((key) => (
                        <motion.button
                            key={key}
                            onClick={() => setActive(key)}
                            whileHover={getButtonHover(0, 1.01)}
                            whileTap={buttonTap}
                            className="rounded-full px-7 py-3 transition-all duration-300"
                            style={{
                                ...(active === key
                                    ? {
                                        backgroundImage:
                                            "linear-gradient(135deg, #518591, #2c3e3b, #e3b01c)",
                                        color: "white",
                                        boxShadow: "0 4px 16px rgba(81,133,145,0.22)",
                                    }
                                    : {
                                        background: "transparent",
                                        color: "#518591",
                                    }),
                            }}
                        >
                            {/* CORRECTION : font-body sur les labels du toggle */}
                            <span className="font-body text-[14px] font-semibold">
                                {key === "essentielle" ? "Essentielle" : "Pro"}
                            </span>
                        </motion.button>
                    ))}
                </motion.div>

                {/* ── LAYOUT CARTE + ANNOTATIONS ── */}
                <div className="flex w-full max-w-5xl items-center justify-center gap-0">

                    {/* Annotations gauche */}
                    <div className="hidden w-[240px] flex-col gap-12 lg:flex">
                        <AnnotationLeft
                            title="Transparent pricing"
                            text="No hidden costs. No emotional overload."
                        />
                        <div className="mt-14">
                            <AnnotationLeft
                                title="Clear onboarding"
                                text="Users instantly understand where to start."
                            />
                        </div>
                    </div>

                    {/* ── CARTE PRICING ── */}
                    <div className="relative z-20 flex-shrink-0">
                        {/* Glow flottant */}
                        <div
                            aria-hidden="true"
                            className="absolute -inset-8 rounded-[32px] opacity-15 blur-3xl"
                            style={{
                                background:
                                    "linear-gradient(135deg, #518591 0%, #e3b01c 100%)",
                            }}
                        />

                        <motion.div
                            {...getRevealProps({ delay: 0.14, y: 28, blur: 10, duration: 0.95 })}
                            className="relative overflow-hidden"
                            style={{
                                width: 380,
                                /*
                                    CORRECTION :
                                    - borderRadius 34 → 20px, cohérent avec toutes les sections
                                    - suppression de animation: rotatingBorder (style jsx supprimé)
                                    - bordure statique élégante à la place
                                */
                                borderRadius: "20px",
                                border: "1.5px solid rgba(81,133,145,0.22)",
                                background:
                                    "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
                                boxShadow:
                                    "0 20px 60px -12px rgba(15,23,42,0.10), 0 4px 16px -4px rgba(15,23,42,0.05)",
                            }}
                        >
                            {/* Shimmer passif */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 overflow-hidden"
                                style={{ borderRadius: "inherit" }}
                            >
                                <motion.div
                                    animate={shimmerSweep}
                                    transition={{ ...shimmerSweepTransition, duration: 3.8 }}
                                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                />
                            </div>

                            <div className="relative p-8 lg:p-9">

                                {/* ── TOP : nom du plan + badge ── */}
                                <div className="mb-7 flex items-center justify-between">
                                    {/*
                                        CORRECTION :
                                        - font-neo-grotesque → font-display
                                        - text-2xl → 20px fixe (titre de carte)
                                    */}
                                    <span
                                        className="font-display font-medium tracking-[-0.02em]"
                                        style={{ fontSize: "20px", color: "#0f172a" }}
                                    >
                                        {plan.name}
                                    </span>

                                    {plan.popular && (
                                        <span
                                            className="rounded-full px-4 py-1.5 font-body text-[11px] font-semibold text-white"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #518591, #2c3e3b)",
                                            }}
                                        >
                                            ✨ Most Popular
                                        </span>
                                    )}
                                </div>

                                {/* ── PRIX ── */}
                                <div className="mb-2 flex items-end gap-2">
                                    {/*
                                        CORRECTION :
                                        - font-neo-grotesque → font-display
                                        - text-7xl → clamp pour responsive propre
                                    */}
                                    <span
                                        className="font-display font-light leading-none tracking-[-0.05em]"
                                        style={{ fontSize: "clamp(52px, 8vw, 72px)", color: "#0f172a" }}
                                    >
                                        {plan.price}
                                    </span>
                                    <span
                                        className="font-body pb-2 text-[17px] font-medium"
                                        style={{ color: "#518591" }}
                                    >
                                        {plan.currency}
                                    </span>
                                </div>

                                {/* CORRECTION : font-body */}
                                <p
                                    className="mb-7 font-body text-[13px]"
                                    style={{ color: "#6B7280" }}
                                >
                                    {plan.billing}
                                </p>

                                {/* ── CTA ── */}
                                <motion.button
                                    whileHover={getButtonHover()}
                                    whileTap={buttonTap}
                                    className="mb-7 w-full py-4 font-body text-[14px] font-semibold text-white"
                                    style={{
                                        borderRadius: "12px",
                                        background:
                                            "linear-gradient(135deg, #518591, #2c3e3b, #e3b01c)",
                                        backgroundSize: "200% 200%",
                                        boxShadow: "0 10px 28px rgba(81,133,145,0.22)",
                                    }}
                                >
                                    Get started
                                </motion.button>

                                {/* ── FEATURES ── */}
                                <ul className="space-y-3.5">
                                    {plan.features.map((feature, i) => (
                                        <motion.li
                                            key={feature}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.32, delay: i * 0.04 }}
                                            className="flex items-center gap-3"
                                        >
                                            <CheckIcon />
                                            {/* CORRECTION : font-body */}
                                            <span
                                                className="font-body text-[14px]"
                                                style={{ color: "#374151" }}
                                            >
                                                {feature}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>

                    {/* Annotations droite */}
                    <div className="hidden w-[240px] flex-col gap-12 lg:flex">
                        <div className="mt-8">
                            <AnnotationRight
                                title="Strong hierarchy"
                                text="The user immediately sees the key value."
                            />
                        </div>
                        <div className="mt-16">
                            <AnnotationRight
                                title="Scannable structure"
                                text="Benefits are easy to compare visually."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── ANNOTATION GAUCHE ────────────────────────────────────────────────────────
function AnnotationLeft({ title, text }: { title: string; text: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-end"
        >
            <div
                className="max-w-[160px] px-4 py-3.5"
                style={{
                    borderRadius: "14px",
                    border: "1px solid rgba(81,133,145,0.10)",
                    background: "rgba(255,255,255,0.72)",
                    backdropFilter: "blur(12px)",
                }}
            >
                {/* CORRECTION : font-display pour le titre, font-body pour le texte */}
                <p
                    className="font-display text-[13px] font-medium tracking-tight"
                    style={{ color: "#0f172a" }}
                >
                    {title}
                </p>
                <p
                    className="mt-1 font-body text-[12px] leading-relaxed"
                    style={{ color: "#6B7280" }}
                >
                    {text}
                </p>
            </div>
            <div
                className="h-px w-14"
                style={{
                    background: "linear-gradient(to right, #518591, transparent)",
                }}
            />
            <div
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ background: "#518591" }}
            />
        </motion.div>
    );
}

// ─── ANNOTATION DROITE ────────────────────────────────────────────────────────
function AnnotationRight({ title, text }: { title: string; text: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-start"
        >
            <div
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ background: "#e3b01c" }}
            />
            <div
                className="h-px w-14"
                style={{
                    background: "linear-gradient(to right, #e3b01c, transparent)",
                }}
            />
            <div
                className="max-w-[160px] px-4 py-3.5"
                style={{
                    borderRadius: "14px",
                    border: "1px solid rgba(227,176,28,0.12)",
                    background: "rgba(255,255,255,0.72)",
                    backdropFilter: "blur(12px)",
                }}
            >
                <p
                    className="font-display text-[13px] font-medium tracking-tight"
                    style={{ color: "#0f172a" }}
                >
                    {title}
                </p>
                <p
                    className="mt-1 font-body text-[12px] leading-relaxed"
                    style={{ color: "#6B7280" }}
                >
                    {text}
                </p>
            </div>
        </motion.div>
    );
}

// ─── CHECK ICON ───────────────────────────────────────────────────────────────
function CheckIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="flex-shrink-0"
            aria-hidden="true"
        >
            <circle cx="8" cy="8" r="7" fill="url(#check-gradient)" />
            <path
                d="M5 8L7 10L11 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <defs>
                <linearGradient id="check-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#518591" />
                    <stop offset="100%" stopColor="#e3b01c" />
                </linearGradient>
            </defs>
        </svg>
    );
}
