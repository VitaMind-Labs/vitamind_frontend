"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Heart } from "lucide-react";
import {
    ambientFloat,
    ambientFloatTransition,
    buttonTap,
    getButtonHover,
    getRevealProps,
    pulseDot,
    pulseDotTransition,
    useSectionInView,
} from "../animations";

export default function CTASection() {
    const { ref: sectionRef } = useSectionInView<HTMLElement>(0.2);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden px-4 py-24 md:px-8 md:py-32"
        >
            {/* ── HALO D'AMBIANCE ── */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="absolute left-[-10%] top-[5%] h-[400px] w-[400px] rounded-full blur-3xl"
                    style={{ background: "rgba(81,133,145,0.05)" }}
                />
                <motion.div
                    animate={ambientFloat}
                    transition={{ ...ambientFloatTransition, duration: 16 }}
                    className="absolute bottom-[-10%] right-[-5%] h-[440px] w-[440px] rounded-full blur-3xl"
                    style={{ background: "rgba(227,176,28,0.05)" }}
                />
            </div>

            {/* Cercles décoratifs en filigrane */}
            <div aria-hidden="true" className="absolute inset-0 opacity-[0.04]">
                <div
                    className="absolute left-10 top-10 h-32 w-32 rounded-full"
                    style={{ border: "1px solid hsl(187,27%,40%)" }}
                />
                <div
                    className="absolute bottom-20 right-20 h-52 w-52 rounded-full"
                    style={{ border: "1px solid hsl(45,93%,47%)" }}
                />
                <div
                    className="absolute right-1/4 top-1/3 h-24 w-24 rounded-full"
                    style={{ border: "1px solid hsl(187,27%,40%)" }}
                />
            </div>

            <div className="relative mx-auto max-w-5xl">
                <motion.div
                    {...getRevealProps({ y: 30, blur: 10, duration: 1.05 })}
                    className="relative overflow-hidden px-6 py-14 md:px-12 md:py-20"
                    style={{
                        borderRadius: "24px",
                        backdropFilter: "blur(16px)",
                    }}
                >
                    {/* Halos internes à la carte */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 overflow-hidden"
                        style={{ borderRadius: "inherit" }}
                    >
                        <div
                            className="absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                            style={{ background: "rgba(81,133,145,0.09)" }}
                        />
                        <div
                            className="absolute bottom-0 right-0 h-[240px] w-[240px] translate-x-1/3 translate-y-1/3 rounded-full blur-3xl"
                            style={{ background: "rgba(227,176,28,0.09)" }}
                        />
                    </div>

                    <div className="relative z-10 text-center">

                        {/* ── BADGE ── */}
                        <motion.div
                            {...getRevealProps({ delay: 0.08, y: 10, blur: 6, duration: 0.7 })}
                            className="mb-8 inline-flex items-center gap-3 rounded-full px-5 py-2.5"
                            style={{
                                border: "1px solid rgba(81,133,145,0.12)",
                                background: "rgba(255,255,255,0.80)",
                                backdropFilter: "blur(12px)",
                            }}
                        >
                            <motion.span
                                animate={pulseDot}
                                transition={pulseDotTransition}
                                className="h-2 w-2 flex-shrink-0 rounded-full"
                                style={{ background: "hsl(45,93%,47%)" }}
                            />
                            {/* CORRECTION : font-body */}
                            <span
                                className="font-body text-[11px] font-semibold uppercase tracking-[0.28em]"
                                style={{ color: "rgba(81,133,145,0.85)" }}
                            >
                                Clinical Excellence
                            </span>
                        </motion.div>

                        {/* ── TITRE PRINCIPAL ── */}
                        <motion.h2
                            {...getRevealProps({ delay: 0.12, y: 22, blur: 8, duration: 0.9 })}
                            /*
                                CORRECTIONS :
                                - font-neo-grotesque → font-display
                                - text-4xl/5xl/7xl → clamp cohérent avec toutes les sections
                                - leading-[0.95] → 1.08 (meilleure lisibilité sur 2 lignes)
                                - tracking-[-0.04em] → -0.03em (standard du projet)
                            */
                            className="font-display mx-auto max-w-4xl font-light tracking-[-0.03em]"
                            style={{
                                fontSize: "clamp(30px, 4.5vw, 58px)",
                                lineHeight: 1.08,
                                color: "hsl(187,27%,40%)",
                            }}
                        >
                            VitaMind does not diagnose,{" "}
                            <br className="hidden md:block" />
                            prescribe, or replace clinicians.
                        </motion.h2>

                        {/* ── DESCRIPTION ── */}
                        <motion.p
                            {...getRevealProps({ delay: 0.2, y: 18, blur: 8, duration: 0.85 })}
                            // {/* CORRECTION : font-body, taille unifiée 16px */}
                            className="mx-auto mt-7 max-w-2xl font-body text-[16px] leading-[1.75]"
                            style={{ color: "rgba(15,23,42,0.65)" }}
                        >
                            It prepares users for clinical encounters with
                            structured, validated, shareable data while
                            escalating acute risk and preserving consent,
                            privacy, and emotional safety.
                        </motion.p>

                        {/* ── CTA ── */}
                        <motion.div
                            {...getRevealProps({ delay: 0.28, y: 16, scale: 0.97, blur: 6, duration: 0.75 })}
                            className="mt-12 flex flex-col items-center gap-5"
                        >
                            <div className="group flex items-center gap-4">
                                {/* Bouton principal */}
                                <motion.button
                                    whileHover={getButtonHover()}
                                    whileTap={buttonTap}
                                    className="relative overflow-hidden rounded-full px-9 py-[14px]"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, hsl(187,27%,40%), hsl(45,93%,47%))",
                                        boxShadow: "0 14px 36px rgba(81,133,145,0.20)",
                                    }}
                                >
                                    {/* CORRECTION : font-body */}
                                    <span className="font-body relative z-10 text-[13px] font-semibold uppercase tracking-[0.20em] text-white">
                                        Start the experience
                                    </span>
                                    {/* Shimmer au hover */}
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-600 group-hover:translate-x-full" />
                                </motion.button>

                                {/* Bouton icône rotatif */}
                                <motion.div
                                    whileHover={{ ...getButtonHover(0, 1.05), rotate: 90 }}
                                    whileTap={buttonTap}
                                    transition={{ duration: 0.28 }}
                                    className="flex h-13 w-13 items-center justify-center rounded-full"
                                    style={{
                                        width: "52px",
                                        height: "52px",
                                        background:
                                            "linear-gradient(135deg, hsl(45,93%,47%), hsl(187,27%,40%))",
                                        boxShadow: "0 10px 28px rgba(227,176,28,0.20)",
                                    }}
                                >
                                    <ArrowRight className="h-5 w-5 text-white" />
                                </motion.div>
                            </div>

                            {/* Metadata de confiance */}
                            <div className="flex flex-wrap items-center justify-center gap-5">
                                <div className="flex items-center gap-2">
                                    <Shield
                                        className="h-3.5 w-3.5 flex-shrink-0"
                                        style={{ color: "hsl(45,93%,47%)" }}
                                    />
                                    {/* CORRECTION : font-body */}
                                    <span
                                        className="font-body text-[12px] font-medium tracking-[0.04em]"
                                        style={{ color: "rgba(81,133,145,0.55)" }}
                                    >
                                        Secure & confidential
                                    </span>
                                </div>

                                <span
                                    className="h-1 w-1 rounded-full"
                                    style={{ background: "rgba(81,133,145,0.22)" }}
                                />

                                <div className="flex items-center gap-2">
                                    <Heart
                                        className="h-3.5 w-3.5 flex-shrink-0"
                                        style={{ color: "hsl(45,93%,47%)" }}
                                    />
                                    <span
                                        className="font-body text-[12px] font-medium tracking-[0.04em]"
                                        style={{ color: "rgba(81,133,145,0.55)" }}
                                    >
                                        Human-centered support
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
