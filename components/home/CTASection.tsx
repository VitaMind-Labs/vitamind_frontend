"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ROUTES } from "@/lib/config/routes";
import { REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, Play } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Magnetic, WordReveal } from "./AnimationUtilities";
import { Grain } from "./Atmosphere";
import { CURTAIN } from "./HomeSection";
import { ACCENT_DARK, LABEL, SERIF } from "./typography";

/** A rising horizon: a warm disc climbs from below as the section arrives, ringed by slow ripples. */
function Horizon({ progress }: { progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
    const reduce = useReducedMotion();
    const rise = useTransform(progress, [0, 0.7], [reduce ? 0 : 38, 0]);
    const grow = useTransform(progress, [0, 0.7], [reduce ? 1 : 0.72, 1]);
    const y = useTransform(rise, (value) => `${value}%`);

    return (
        <motion.div aria-hidden style={{ y, scale: grow }} className="pointer-events-none absolute -bottom-[62vmin] left-1/2 -z-10 size-[130vmin] -translate-x-1/2">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgb(227_176_28/0.55),rgb(212_179_124/0.28)_38%,rgb(81_133_145/0.2)_62%,transparent_78%)] blur-[2px]" />
            <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.5),rgb(227_176_28/0.35)_55%,transparent)] blur-xl" />
            {reduce
                ? null
                : [0, 1, 2].map((i) => (
                      <motion.span
                          key={i}
                          className="absolute inset-0 rounded-full border border-white/20"
                          initial={{ scale: 0.55, opacity: 0 }}
                          animate={{ scale: [0.55, 1.05], opacity: [0, 0.5, 0] }}
                          transition={{ duration: 9, repeat: Infinity, delay: i * 3, ease: "easeOut" }}
                      />
                  ))}
        </motion.div>
    );
}

/** Closing chapter: a rising horizon, oversized type, and one round button that follows the hand. */
export const CTASection = () => {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.cta;
    const ref = useRef<HTMLElement>(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });

    return (
        <section
            id="cta"
            ref={ref}
            className={cn(
                "relative isolate overflow-hidden bg-[linear-gradient(170deg,var(--color-teal-900),var(--color-ink)_90%)] pb-14 pt-28 text-white md:pb-16 md:pt-44",
                CURTAIN,
            )}
        >
            <Grain />
            <Horizon progress={scrollYProgress} />

            <div className="page-container">
                <motion.div variants={stagger(0.09, 0.05)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT}>
                    <div className="grid items-end gap-14 lg:grid-cols-12 lg:gap-10">
                        <div className="lg:col-span-8">
                            <motion.p variants={fadeUp()} className={cn(LABEL, "flex items-center gap-3 text-teal-200")}>
                                <span aria-hidden className="h-px w-10 bg-gold-300" />
                                {copy.eyebrow}
                            </motion.p>

                            <h2 className={cn(SERIF, "mt-8 text-[clamp(3.25rem,8.2vw+0.5rem,8.5rem)] font-light leading-[0.96] tracking-[-0.04em] text-white rtl:tracking-normal")}>
                                <span className="block">
                                    <WordReveal>{copy.titleA}</WordReveal>
                                </span>
                                <span className="block">
                                    <WordReveal className={ACCENT_DARK} delay={0.15}>
                                        {copy.titleB}
                                    </WordReveal>
                                </span>
                            </h2>
                        </div>

                        <div className="flex flex-col items-start gap-10 lg:col-span-4 lg:items-end lg:text-end">
                            <motion.p variants={fadeUp()} className="max-w-md text-[clamp(1.0625rem,0.3vw+1rem,1.25rem)] leading-[1.75] text-teal-100">
                                {copy.body}
                            </motion.p>

                            <motion.div variants={fadeUp(0, 24)} className="relative">
                                {/* A slow dashed ring turns around the button */}
                                <motion.span
                                    aria-hidden
                                    className="pointer-events-none absolute -inset-4 rounded-full border border-dashed border-white/30"
                                    animate={reduce ? undefined : { rotate: 360 }}
                                    transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
                                />
                                <Magnetic strength={0.3}>
                                    <Link
                                        href={ROUTES.orientation}
                                        className="group relative grid size-40 place-items-center overflow-hidden rounded-full bg-white text-ink shadow-[0_30px_60px_-24px_rgb(0_0_0/0.6)] transition-transform duration-500 ease-out-soft hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-gold-300 md:size-48"
                                    >
                                        {/* Warmth floods in from the pointer's side of the disc */}
                                        <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-gold-300 transition-transform duration-700 ease-out-soft group-hover:scale-y-100" />
                                        <span className="relative z-10 flex flex-col items-center gap-3 px-6 text-center text-[0.9375rem] font-semibold leading-snug">
                                            {copy.primary}
                                            <ArrowRight className="size-5 transition-transform duration-500 ease-out-soft group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
                                        </span>
                                    </Link>
                                </Magnetic>
                            </motion.div>
                        </div>
                    </div>

                    <motion.div variants={fadeUp(0, 12)} className="mt-24 flex flex-col gap-6 border-t border-white/15 pt-7 md:mt-32 lg:flex-row lg:items-center lg:justify-between">
                        <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[0.9375rem] text-white/90">
                            {copy.benefits.map((text) => (
                                <li key={text} className="flex items-center gap-2.5">
                                    <Check className="size-4 text-gold-300" aria-hidden />
                                    {text}
                                </li>
                            ))}
                        </ul>
                        <a
                            href="#how-it-works"
                            className="group inline-flex w-fit items-center gap-3 rounded-md text-[0.9375rem] font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-300"
                        >
                            <span className="flex size-9 items-center justify-center rounded-full border border-white/25 bg-white/5 transition-[transform,background-color] duration-300 group-hover:scale-110 group-hover:bg-white/15">
                                <Play className="size-3.5 fill-current rtl:-scale-x-100" aria-hidden />
                            </span>
                            <span className="home-link-line">{copy.demo}</span>
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
