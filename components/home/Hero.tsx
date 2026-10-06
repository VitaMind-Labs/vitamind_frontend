"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthSession } from "@/hooks/useAuthSession";
import { agentEntryHref } from "@/lib/config/routes";
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Magnetic, WordReveal } from "./AnimationUtilities";
import { Grain } from "./Atmosphere";
import { GLSLHills } from "./GLSLHills";
import { Marquee } from "./Interactions";
import { ACCENT_LIGHT, BODY, DISPLAY_XL } from "./typography";

/** "deserves better care" → plain lead + the last two words as the olive-gold accent. */
function splitAccent(text: string, accentWords = 2) {
    const words = text.split(" ");
    const cut = Math.max(0, words.length - accentWords);
    return { lead: words.slice(0, cut).join(" "), accent: words.slice(cut).join(" ") };
}

/** Motes of light rising through the landscape: [left %, size px, seconds, delay, gold?]. */
const MOTES = [
    [8, 4, 13, 0, true], [16, 3, 16, 3, false], [24, 5, 12, 6, true], [33, 3, 18, 1, false],
    [41, 4, 14, 8, true], [52, 3, 17, 4, false], [60, 5, 12, 9, true], [69, 3, 15, 2, false],
    [77, 4, 13, 7, true], [85, 3, 19, 5, false], [92, 5, 14, 10, true],
] as const;

function Motes() {
    const reduce = useReducedMotion();
    if (reduce) return null;
    return (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 top-1/3 -z-10 overflow-hidden">
            {MOTES.map(([left, size, seconds, delay, gold]) => (
                <motion.span
                    key={left}
                    className={cn("absolute bottom-0 rounded-full", gold ? "bg-gold shadow-[0_0_14px_3px_rgb(201_175_111/0.45)]" : "bg-teal-300 shadow-[0_0_12px_3px_rgb(134_186_188/0.45)]")}
                    style={{ left: `${left}%`, width: size, height: size }}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: [0, -420], opacity: [0, 0.9, 0] }}
                    transition={{ duration: seconds, delay, repeat: Infinity, ease: "easeOut" }}
                />
            ))}
        </div>
    );
}


/** A single brush stroke drawn under the accent phrase once the headline has landed. */
function Swash() {
    return (
        <svg aria-hidden viewBox="0 0 400 16" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 -bottom-[0.14em] h-[0.16em] w-full overflow-visible text-gold">
            <motion.path
                d="M2 10 C 70 2, 150 15, 230 7 S 350 11, 398 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 1.4, delay: 1.7, ease: EASE_OUT }}
            />
        </svg>
    );
}

export const Hero = () => {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.hero;
    const home = dictionary.home;
    const reduce = useReducedMotion();
    const { signedIn } = useAuthSession();
    const { lead, accent } = splitAccent(copy.titleB);

    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "70% start"] });

    // Leaving the hero: the headline recedes, the camera glides forward over the hills.
    const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -110]);
    const copyScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.94]);
    const copyOpacity = useTransform(scrollYProgress, [0, 0.85], [1, reduce ? 1 : 0]);
    const hillsY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);

    // A soft light follows the pointer across the mist.
    const mx = useMotionValue(50);
    const my = useMotionValue(36);
    const sx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
    const sy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });
    const spotlight = useMotionTemplate`radial-gradient(38rem circle at ${sx}% ${sy}%, rgb(255 255 255 / 0.9), rgb(255 255 255 / 0.2) 45%, transparent 70%)`;

    const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
        if (reduce || event.pointerType !== "mouse" || !heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        mx.set(((event.clientX - rect.left) / rect.width) * 100);
        my.set(((event.clientY - rect.top) / Math.min(rect.height, 900)) * 100);
    };

    return (
        <section
            ref={heroRef}
            id="home"
            onPointerMove={onPointerMove}
            className="relative isolate overflow-hidden pb-10 md:pb-16 bg-[radial-gradient(60%_46rem_at_0%_12%,rgb(191_221_225/0.5),transparent_70%),radial-gradient(55%_42rem_at_100%_16%,rgb(230_213_170/0.42),transparent_70%),linear-gradient(180deg,#ffffff_0%,var(--color-canvas)_100%)]"
        >
            <Grain tone="light" />
            <motion.div aria-hidden style={{ background: spotlight }} className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[100svh] min-h-[44rem]" />

            {/* The landscape — WebGL hills that drift with the pointer and advance as you scroll */}
            <motion.div style={{ y: hillsY }} aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[100svh] min-h-[44rem] [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_78%,transparent)]">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2.6, ease: "easeOut" }} className="absolute inset-0">
                    <GLSLHills progress={scrollYProgress} cameraZ={118} />
                </motion.div>
            </motion.div>
            <Motes />

            {/* ===== First screen ===== */}
            <div className="relative z-10 flex min-h-[100svh] flex-col">
                <motion.div
                    style={{ y: copyY, scale: copyScale, opacity: copyOpacity }}
                    className="flex flex-1 flex-col items-center justify-center px-4 pb-8 pt-32 text-center sm:px-6 sm:pt-36 lg:px-8"
                >
                    <div className="w-full max-w-6xl">
                        <h1 className={cn(DISPLAY_XL, "mx-auto text-ink")}>
                            <span className="block">
                                <WordReveal delay={0.3}>{copy.titleA}</WordReveal>
                            </span>
                            <span className="block">
                                {lead ? (
                                    <>
                                        <WordReveal delay={0.5}>{lead}</WordReveal>{" "}
                                    </>
                                ) : null}
                                <span className="relative inline-block">
                                    <WordReveal className={ACCENT_LIGHT} delay={0.75}>
                                        {accent}
                                    </WordReveal>
                                    <Swash />
                                </span>
                            </span>
                        </h1>

                        <motion.div variants={stagger(0.12, 1.1)} initial="hidden" animate="show">
                            <motion.p variants={fadeUp(0, 16)} className={cn(BODY, "mx-auto mt-10 max-w-2xl")}>
                                {copy.subtitle}
                            </motion.p>

                            <motion.div variants={fadeUp(0, 16)} className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
                                <Magnetic className="justify-center" strength={0.22}>
                                    <Button asChild variant="hero" size="lg" className="group min-h-14 w-full px-8 sm:w-auto">
                                        <Link href={agentEntryHref("mira", signedIn)}>
                                            {copy.primary}
                                            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
                                        </Link>
                                    </Button>
                                </Magnetic>
                                <Magnetic className="justify-center" strength={0.12}>
                                    <Button asChild variant="outline" size="lg" className="group min-h-14 w-full border-line-strong bg-white/70 px-6 backdrop-blur sm:w-auto">
                                        <a href="#healthcare">
                                            <span className="flex size-8 items-center justify-center rounded-full bg-teal-50 text-teal-700 transition-transform duration-300 group-hover:scale-110">
                                                <Stethoscope className="size-3.5" aria-hidden />
                                            </span>
                                            {copy.demo}
                                        </a>
                                    </Button>
                                </Magnetic>
                            </motion.div>

                        </motion.div>
                    </div>
                </motion.div>

                {/* Bottom of the first screen: a cue to keep going, and the screening references drifting by */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 2 }} className="pb-7">
                    <a href="#why" className="group mx-auto mb-6 flex w-fit flex-col items-center gap-3 rounded-md text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500 rtl:tracking-normal">
                        {copy.discover}
                        <span aria-hidden className="relative h-10 w-px overflow-hidden bg-line-strong">
                            <motion.span
                                className="absolute inset-x-0 top-0 h-1/2 bg-gold"
                                animate={reduce ? undefined : { y: ["-100%", "200%"] }}
                                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </span>
                    </a>
                    <div role="group" aria-label="Screening references" className="border-y border-line/80 bg-white/40 py-3.5 backdrop-blur-sm">
                        <Marquee seconds={36}>
                            {home.chips.map((chip) => (
                                <span key={chip} className="inline-flex items-center gap-3 whitespace-nowrap px-5 text-[0.875rem] font-medium text-ink-soft" dir="auto">
                                    <span aria-hidden className="size-1.5 rounded-full bg-gold" />
                                    {chip}
                                </span>
                            ))}
                        </Marquee>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
