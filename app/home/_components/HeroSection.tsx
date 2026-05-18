"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GLSLHills } from "./GLSLHills";
import {
    ambientFloat,
    ambientFloatTransition,
    buttonTap,
    getButtonHover,
    getRevealProps,
    shimmerSweep,
    shimmerSweepTransition,
} from "../animations";

// ─── CONSTANTES ──────────────────────────────────────────────────────────────
const FULL_TITLE = "VitaMind";
const TYPEWRITER_SPEED = 150; // ms par caractère

export default function HeroSection() {
    const [displayText, setDisplayText] = useState("");
    const [isTypingDone, setIsTypingDone] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Typewriter propre — curseur disparaît à la fin
    useEffect(() => {
        let i = 0;
        timerRef.current = setInterval(() => {
            i++;
            setDisplayText(FULL_TITLE.slice(0, i));
            if (i >= FULL_TITLE.length) {
                clearInterval(timerRef.current!);
                // Curseur clignote encore 1.5s puis disparaît
                setTimeout(() => setIsTypingDone(true), 1500);
            }
        }, TYPEWRITER_SPEED);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return (
        <section className="relative w-full overflow-hidden bg-[var(--color-bg,#F0F0F0)]">
            {/* ─── ZONE VISUELLE ─── */}
            <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden">
                {/* Background GLSL */}
                <div className="absolute inset-0 z-0">
                    <GLSLHills />
                </div>

                <motion.div
                    animate={ambientFloat}
                    transition={{ ...ambientFloatTransition, duration: 18 }}
                    className="absolute left-[12%] top-[16%] z-10 h-48 w-48 rounded-full blur-[100px]"
                    style={{ background: "rgba(81,133,145,0.14)" }}
                />
                <motion.div
                    animate={ambientFloat}
                    transition={{ ...ambientFloatTransition, duration: 14, delay: 0.8 }}
                    className="absolute bottom-[18%] right-[12%] z-10 h-56 w-56 rounded-full blur-[110px]"
                    style={{ background: "rgba(227,176,28,0.10)" }}
                />

                <div
                    aria-hidden="true"
                    className="absolute inset-0 z-10 opacity-[0.05]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at top, rgba(255,255,255,0.9), transparent 34%), linear-gradient(rgba(44,62,59,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(44,62,59,0.14) 1px, transparent 1px)",
                        backgroundSize: "100% 100%, 84px 84px, 84px 84px",
                    }}
                />

                {/* Overlay contenu — centré */}
                <div className="relative z-20 flex h-full items-center justify-center px-6 text-center">
                    <motion.div
                        {...getRevealProps({ y: 20, blur: 18, duration: 1.2 })}
                        className="max-w-5xl flex flex-col items-center"
                    >
                        <motion.div
                            {...getRevealProps({ delay: 0.12, y: 12, blur: 6, duration: 0.85 })}
                            className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/55 px-5 py-2.5 backdrop-blur-xl"
                        >
                            <span
                                className="font-body text-[11px] font-semibold uppercase tracking-[0.30em]"
                                style={{ color: "#518591" }}
                            >
                                Premium Behavioral Intelligence
                            </span>
                        </motion.div>

                        {/* ── TITRE PRINCIPAL ── */}
                        <div className="relative mb-8">
                            <h1
                                className="
                                    font-display
                                    text-[clamp(56px,10vw,120px)]
                                    font-extralight
                                    tracking-[-0.04em]
                                    leading-none
                                    relative
                                    inline-block
                                    select-none
                                    text-transparent
                                    bg-clip-text
                                "
                                style={{
                                    backgroundImage:
                                        "linear-gradient(135deg, #2c3e3b 0%, #518591 50%, #e3b01c 100%)",
                                }}
                            >
                                {/* Texte principal */}
                                <span>{displayText}</span>

                                {/* Glitch layer — imperceptible, juste un souffle */}
                                <motion.span
                                    aria-hidden="true"
                                    className="absolute top-0 left-0 w-full text-transparent bg-clip-text pointer-events-none"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(135deg, #518591 0%, #e3b01c 100%)",
                                    }}
                                    animate={{
                                        x: [0, -2, 2, -1, 0],
                                        opacity: [0, 0.3, 0, 0.15, 0],
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        times: [0, 0.15, 0.35, 0.6, 1],
                                        repeat: Infinity,
                                        repeatDelay: 6,
                                    }}
                                >
                                    {displayText}
                                </motion.span>

                                {/* Curseur — disparaît quand l'écriture est terminée */}
                                <motion.span
                                    aria-hidden="true"
                                    className="inline-block w-[2px] bg-[#e3b01c] ml-2 align-middle"
                                    style={{
                                        height: "0.72em",
                                        verticalAlign: "middle",
                                    }}
                                    animate={
                                        isTypingDone
                                            ? { opacity: 0, transition: { duration: 0.4 } }
                                            : { opacity: [1, 0, 1] }
                                    }
                                    transition={
                                        isTypingDone
                                            ? { duration: 0.4 }
                                            : { duration: 0.75, repeat: Infinity }
                                    }
                                />
                            </h1>
                        </div>

                        {/* ── SOUS-TITRE ── */}
                        <motion.div
                            {...getRevealProps({ delay: 1.15, y: 18, blur: 8, duration: 0.95 })}
                            className="relative flex flex-col items-center"
                        >
                            <p
                                className="
                                    font-body
                                    text-[clamp(19px,2.5vw,28px)]
                                    font-light
                                    tracking-wide
                                    leading-[1.6]
                                    italic
                                    max-w-2xl
                                    mx-auto
                                "
                                style={{ color: "rgba(44,62,59,0.82)" }}
                            >
                                Giving the soul a voice, and the mind its colors.
                            </p>

                            {/* Ligne décorative — s'étend à l'entrée */}
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 52, opacity: 1 }}
                                transition={{ delay: 1.9, duration: 0.85, ease: "easeInOut" }}
                                className="h-[2px] bg-[#e3b01c] mx-auto mt-6 rounded-full"
                            />
                        </motion.div>

                        <motion.div
                            {...getRevealProps({ delay: 1.45, y: 18, blur: 8, duration: 0.9 })}
                            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
                        >
                            <motion.div
                                whileHover={getButtonHover()}
                                whileTap={buttonTap}
                            >
                                <Link
                                    href="/diagnostic"
                                    className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[hsl(187,27%,40%)] to-[hsl(45,93%,47%)] px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_18px_48px_rgba(81,133,145,0.22)]"
                                >
                                    <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.24),transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    <span className="relative z-10 font-body">Start assessment</span>
                                    <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </Link>
                            </motion.div>

                            <motion.a
                                href="#platform"
                                whileHover={getButtonHover(0, 1.01)}
                                whileTap={buttonTap}
                                className="group inline-flex items-center gap-3 rounded-full border border-[rgba(81,133,145,0.18)] bg-white/70 px-8 py-4 font-body text-[12px] font-semibold uppercase tracking-[0.22em] text-[hsl(187,27%,40%)] backdrop-blur-xl"
                            >
                                <span>Explore platform</span>
                                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Fondu bas vers le fond de page */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-20"
                    style={{
                        background:
                            "linear-gradient(to top, var(--color-bg, #F0F0F0), transparent)",
                    }}
                />
            </div>

            {/* ─── BANDE D'INFOS BAS ─── */}
            <motion.div
                {...getRevealProps({ delay: 1.5, y: 24, blur: 10, duration: 1.05 })}
                className="relative z-20 mx-auto max-w-7xl px-6 pb-14 md:px-10 lg:px-16"
            >
                <div
                    className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-[28px] border border-white/30 bg-white/45 px-6 pt-8 backdrop-blur-xl md:flex-row md:px-8"
                    style={{ borderTop: "1px solid rgba(44,62,59,0.10)" }}
                >
                    <motion.div
                        aria-hidden="true"
                        animate={shimmerSweep}
                        transition={{ ...shimmerSweepTransition, duration: 4.2 }}
                        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                    />

                    {/* Scroll indicator */}
                    <motion.button
                        whileHover={getButtonHover(0, 1.04)}
                        whileTap={buttonTap}
                        className="group flex cursor-pointer flex-col items-center gap-2 select-none"
                    >
                        <span
                            className="font-body text-[11px] font-semibold uppercase tracking-[0.28em]"
                            style={{ color: "#518591" }}
                        >
                            Explore
                        </span>
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300"
                            style={{
                                border: "1px solid rgba(81,133,145,0.22)",
                            }}
                        >
                            <ArrowDown
                                className="h-3.5 w-3.5 animate-bounce"
                                style={{ color: "#2c3e3b" }}
                            />
                        </div>
                    </motion.button>

                    {/* ── PARAGRAPHE TECHNIQUE ──
                        CORRECTION : on retire font-mono — incohérent avec l'identité.
                        On utilise font-body (DM Sans) en small, style metadata.        */}
                    <div className="max-w-md text-center md:text-right">
                        <p
                            className="font-body text-[13px] font-normal leading-relaxed tracking-tight"
                            style={{ color: "rgba(44,62,59,0.65)" }}
                        >
                            Bringing together data, automation, and intelligent systems
                            into a unified engine of discovery, focused on{" "}
                            <span
                                className="font-medium"
                                style={{ color: "#518591" }}
                            >
                                platform intelligence
                            </span>
                            .
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
