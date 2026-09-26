"use client";

import { Button } from "@/components/ui/button";
import { GLSLHills } from "@/components/home/GLSLHills";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, Check, Play, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { Magnetic, TextReveal } from "./AnimationUtilities";
import { ProductPreview } from "./ProductPreview";

/** A small floating card that drifts at its own depth while the product settles. */
function Callout({ y, className, delay, children }: { y: MotionValue<number>; className: string; delay: number; children: ReactNode }) {
    return (
        <motion.div style={{ y }} className={className} aria-hidden>
            <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay, ease: EASE_OUT }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}

export const Hero = () => {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.hero;
    const home = dictionary.home;
    const reduce = useReducedMotion();

    const copyRef = useRef<HTMLDivElement>(null);
    const deviceRef = useRef<HTMLDivElement>(null);

    // Headline drifts up and softens as the reader leaves it.
    const { scrollYProgress: copyProgress } = useScroll({ target: copyRef, offset: ["start start", "end start"] });
    const copyY = useTransform(copyProgress, [0, 1], [0, reduce ? 0 : -90]);
    const copyOpacity = useTransform(copyProgress, [0, 0.85], [1, reduce ? 1 : 0.15]);
    const landscapeY = useTransform(copyProgress, [0, 1], [0, reduce ? 0 : 140]);

    // The product rises from a tilted, receding plane to face the reader.
    const { scrollYProgress: deviceProgress } = useScroll({ target: deviceRef, offset: ["start end", "start 0.18"] });
    const settle = useSpring(deviceProgress, { stiffness: 110, damping: 28, mass: 0.35 });
    const rotateX = useTransform(settle, [0, 1], [reduce ? 0 : 24, 0]);
    const scale = useTransform(settle, [0, 1], [reduce ? 1 : 0.88, 1]);
    const deviceY = useTransform(settle, [0, 1], [reduce ? 0 : 60, 0]);
    const glowOpacity = useTransform(settle, [0, 1], [0.25, 0.9]);
    const calloutNear = useTransform(settle, [0, 1], [reduce ? 0 : 140, 0]);
    const calloutFar = useTransform(settle, [0, 1], [reduce ? 0 : 90, 0]);

    return (
        <section id="home" className="relative overflow-hidden bg-white">
            {/* Landscape backdrop — spans the headline and the top of the product. */}
            <motion.div style={{ y: landscapeY }} className="absolute inset-x-0 top-0 -z-0 h-[115svh] min-h-[48rem]" aria-hidden>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.8, ease: "easeOut" }} className="absolute inset-0">
                    <GLSLHills />
                </motion.div>
                <div className="absolute inset-0 bg-[radial-gradient(65%_50%_at_50%_32%,rgb(255_255_255/0.95),rgb(255_255_255/0.6)_55%,transparent_80%)]" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent" />
            </motion.div>

            {/* ===== Headline ===== */}
            <motion.div
                ref={copyRef}
                style={{ y: copyY, opacity: copyOpacity }}
                className="relative z-10 flex min-h-[min(46rem,82svh)] flex-col items-center justify-center px-4 pb-10 pt-32 text-center sm:px-6 sm:pt-36 lg:px-8"
            >
                <motion.div variants={stagger(0.1, 0.15)} initial="hidden" animate="show" className="w-full max-w-4xl">
                   

                    <h1 className="home-heading mx-auto mt-7 max-w-4xl text-display font-light">
                        <TextReveal delay={0.3}>{copy.titleA}</TextReveal>{" "}
                        <TextReveal delay={0.44}>
                            <span className="home-heading-accent font-normal">{copy.titleB}</span>
                        </TextReveal>
                    </h1>

                    <motion.p variants={fadeUp(0.45)} className="home-body mx-auto mt-6 max-w-2xl">
                        {copy.subtitle}
                    </motion.p>

                    <motion.div variants={fadeUp(0.55)} className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                        <Magnetic className="justify-center">
                            <Button asChild variant="hero" size="lg" className="group min-h-13 w-full px-7 sm:w-auto">
                                <Link href="/diagnostic">
                                    {copy.primary}
                                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
                                </Link>
                            </Button>
                        </Magnetic>
                        <Button asChild variant="outline" size="lg" className="group min-h-13 bg-white/85 px-5 backdrop-blur">
                            <a href="#how-it-works">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-teal-700 transition-transform duration-300 group-hover:scale-105">
                                    <Play className="h-3.5 w-3.5 fill-current rtl:-scale-x-100" aria-hidden />
                                </span>
                                {copy.demo}
                            </a>
                        </Button>
                    </motion.div>

                    <motion.ul variants={fadeUp(0.65)} className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2" aria-label="Screening references">
                        {home.chips.map((chip) => (
                            <li key={chip} className="rounded-full border border-line bg-white/85 px-3 py-1 text-xs text-ink-muted backdrop-blur" dir="auto">
                                {chip}
                            </li>
                        ))}
                    </motion.ul>
                </motion.div>
            </motion.div>

            {/* ===== Product stage ===== */}
            <div className="relative z-10 pb-20 md:pb-32">
                <div ref={deviceRef} className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" style={{ perspective: "1800px" }}>
                    {/* Brand glow the product settles onto */}
                    <motion.div
                        style={{ opacity: glowOpacity }}
                        aria-hidden
                        className="pointer-events-none absolute inset-x-[8%] top-[18%] -z-10 h-[70%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(81_133_145/0.35),rgb(227_176_28/0.12)_60%,transparent)] blur-2xl"
                    />

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.7, ease: EASE_OUT }}
                        style={{ rotateX, scale, y: deviceY, transformOrigin: "50% 0%", transformStyle: "preserve-3d" }}
                        className="will-change-transform"
                    >
                        <ProductPreview />
                    </motion.div>

                    <Callout y={calloutNear} delay={1.4} className="absolute -top-5 end-2 z-20 hidden sm:block md:-end-2 lg:-end-6">
                        <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-white/95 p-3 pe-4 shadow-raised backdrop-blur">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                                <Check className="h-4 w-4" />
                            </span>
                            <div>
                                <div className="text-xs font-semibold text-ink">{copy.insight}</div>
                                <div className="text-[0.6875rem] text-ink-muted">{copy.pattern}</div>
                            </div>
                        </div>
                    </Callout>

                    <Callout y={calloutFar} delay={1.6} className="absolute -bottom-5 start-6 z-20 md:start-0 lg:-start-6">
                        <div className="flex items-center gap-2 rounded-xl bg-ink px-3.5 py-2.5 text-white shadow-raised">
                            <ShieldCheck className="h-4 w-4 text-sage" />
                            <span className="text-xs font-semibold">{copy.encrypted}</span>
                        </div>
                    </Callout>

                </div>
            </div>
        </section>
    );
};
