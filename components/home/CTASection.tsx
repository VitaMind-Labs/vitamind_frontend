"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Magnetic } from "./AnimationUtilities";

/** Closing band: the one dark moment on the page, so the final call to action lands. */
export const CTASection = () => {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.cta;
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const glowY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -60, reduce ? 0 : 60]);

    return (
        <section id="cta" className="relative bg-white py-16 md:py-24">
            <div className="page-container">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={REVEAL_VIEWPORT}
                    transition={{ duration: 0.9, ease: EASE_OUT }}
                    className="relative isolate overflow-hidden rounded-[2rem] bg-[linear-gradient(150deg,var(--color-teal-900),var(--color-ink)_55%,#1f2e2c)] px-5 py-16 text-center shadow-float sm:px-10 md:rounded-[2.5rem] md:py-24"
                >
                    {/* Light sources — drift slightly with scroll */}
                    <motion.div style={{ y: glowY }} aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                        <div className="absolute -top-32 start-1/2 h-80 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-teal-500/35 blur-3xl rtl:translate-x-1/2" />
                        <div className="absolute -bottom-40 end-[-10%] h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
                    </motion.div>
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
                        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)", backgroundSize: "28px 28px" }}
                    />

                    <motion.div variants={stagger(0.09, 0.15)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT}>
                        <motion.p variants={fadeUp()} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-teal-100">
                            <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden />
                            {copy.eyebrow}
                        </motion.p>

                        <motion.h2 variants={fadeUp()} className="mx-auto mt-7 max-w-3xl text-heading font-light tracking-[-0.03em] text-white">
                            {copy.titleA}{" "}
                            <span className="bg-[linear-gradient(120deg,var(--color-teal-200),var(--color-gold-300)_70%,var(--color-gold))] bg-clip-text text-transparent rtl:bg-[linear-gradient(240deg,var(--color-teal-200),var(--color-gold-300)_70%,var(--color-gold))]">
                                {copy.titleB}
                            </span>
                        </motion.h2>

                        <motion.p variants={fadeUp()} className="mx-auto mt-5 max-w-2xl text-lead text-teal-100/80">
                            {copy.body}
                        </motion.p>

                        <motion.div variants={fadeUp()} className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                            <Magnetic className="justify-center">
                                <Button asChild size="lg" className="group min-h-13 w-full bg-white px-7 text-ink shadow-[0_18px_40px_-16px_rgb(0_0_0/0.5)] hover:bg-teal-50 hover:text-ink sm:w-auto">
                                    <Link href="/diagnostic">
                                        {copy.primary}
                                        <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
                                    </Link>
                                </Button>
                            </Magnetic>
                            <Button asChild variant="outline" size="lg" className="group min-h-13 border-white/20 bg-white/5 px-5 text-white hover:border-white/40 hover:bg-white/10 hover:text-white focus-visible:ring-offset-ink">
                                <a href="#how-it-works">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                                        <Play className="h-3.5 w-3.5 fill-current rtl:-scale-x-100" aria-hidden />
                                    </span>
                                    {copy.demo}
                                </a>
                            </Button>
                        </motion.div>

                        <motion.ul variants={fadeUp()} className="mt-10 flex flex-wrap items-center justify-center gap-2.5 text-sm text-teal-100/85">
                            {copy.benefits.map((text) => (
                                <li key={text} className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2">
                                    <Check className="h-4 w-4 text-sage" aria-hidden />
                                    {text}
                                </li>
                            ))}
                        </motion.ul>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
