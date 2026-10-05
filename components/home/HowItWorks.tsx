"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { BookOpen, Compass, FileText, TrendingUp, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { pad } from "./accents";
import { CURTAIN } from "./HomeSection";
import { SectionHeader } from "./SectionHeader";
import { LABEL, SERIF } from "./typography";

type Step = readonly [string, string, readonly string[]];

const ICONS: LucideIcon[] = [Compass, BookOpen, TrendingUp, FileText];

/**
 * The journey's colour: mist, then aqua, then teal, then gold — from the first soft step to the last, warm one.
 * Each panel is a soft gradient of two neighbouring tones from the logo's palette.
 */
const PANELS = [
    { surface: "bg-[linear-gradient(150deg,#eaf4f5,#bfdde1)]", numeral: "text-teal-900", body: "text-ink-soft", label: "text-teal-700", chip: "border-teal-400/40 bg-white/60 text-teal-800", icon: "bg-white/70 text-teal-700", title: "text-ink" },
    { surface: "bg-[linear-gradient(150deg,#b4d8da,#86babc)]", numeral: "text-teal-900", body: "text-teal-900", label: "text-teal-900", chip: "border-teal-900/20 bg-white/45 text-teal-900", icon: "bg-white/60 text-teal-800", title: "text-teal-900" },
    { surface: "bg-[linear-gradient(150deg,#2b7080,#114c61)]", numeral: "text-gold-100", body: "text-teal-100", label: "text-gold-100", chip: "border-white/25 bg-white/10 text-white", icon: "bg-white/10 text-gold-100", title: "text-white" },
    { surface: "bg-[linear-gradient(150deg,#ecdfb6,#c9af6f)]", numeral: "text-teal-900", body: "text-teal-900", label: "text-teal-900", chip: "border-teal-900/20 bg-white/45 text-teal-900", icon: "bg-white/55 text-teal-800", title: "text-teal-900" },
] as const;

type PanelProps = { step: Step; index: number; label: string; railX?: MotionValue<number>; stride?: number; className?: string };

const DRIFT_LIMIT = 56;

/** One step as a large soft panel: the numeral oversized in serif on the start side, the words on the other. */
function Panel({ step, index, label, railX, stride = 0, className }: PanelProps) {
    const tone = PANELS[index % PANELS.length];
    const Icon = ICONS[index % ICONS.length];
    const idle = useMotionValue(0);
    // The numeral lags its own panel a little as the rail passes, then settles. Measured per panel and capped, so it never reaches the words.
    const drift = useTransform(railX ?? idle, (value) => Math.max(-DRIFT_LIMIT, Math.min(DRIFT_LIMIT, (value + index * stride) * -0.12)));

    return (
        <motion.li variants={fadeUp(0, 28)} className={cn("relative isolate flex overflow-hidden rounded-[2.5rem]", tone.surface, className)}>
            <motion.span
                aria-hidden
                style={railX ? { x: drift } : undefined}
                className={cn(
                    SERIF,
                    "pointer-events-none absolute -bottom-[0.1em] start-6 hidden select-none text-[clamp(7rem,min(17vw,40svh),16rem)] font-extralight leading-none tracking-[-0.06em] tabular-nums md:block lg:start-8 rtl:tracking-normal",
                    tone.numeral,
                )}
            >
                {pad(index + 1)}
            </motion.span>

            <div className="relative ms-auto flex w-full flex-col justify-between gap-8 p-6 sm:p-9 sm:max-w-[28rem] lg:max-w-[30rem] lg:gap-6 lg:p-10 xl:p-12">
                <div className="flex items-center gap-3">
                    <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-full", tone.icon)}>
                        <Icon className="size-5" strokeWidth={1.5} aria-hidden />
                    </span>
                    <p className={cn(LABEL, tone.label)}>
                        {label} {pad(index + 1)}
                    </p>
                    {/* Small screens: the numeral sits in the panel's header instead of behind the words */}
                    <span aria-hidden className={cn(SERIF, "ms-auto text-[3.25rem] font-extralight leading-none tracking-[-0.05em] tabular-nums opacity-70 md:hidden rtl:tracking-normal", tone.numeral)}>
                        {pad(index + 1)}
                    </span>
                </div>

                <div>
                    <h3 className={cn(SERIF, "text-[clamp(1.75rem,1.4vw+1.3rem,2.625rem)] font-light leading-[1.1] tracking-[-0.02em] rtl:font-sans rtl:font-semibold rtl:tracking-normal", tone.title)}>
                        {step[0]}
                    </h3>
                    <p className={cn("mt-4 text-[1.0625rem] leading-8", tone.body)}>{step[1]}</p>
                </div>

                <ul className="flex flex-wrap gap-2">
                    {step[2].map((detail) => (
                        <li key={detail} className={cn("rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-medium", tone.chip)}>
                            {detail}
                        </li>
                    ))}
                </ul>
            </div>
        </motion.li>
    );
}

/** Wide screens: a horizontal journey driven by the vertical scroll — the rail slides, the numerals drift against it. */
function Journey({ steps, label, className }: { steps: readonly Step[]; label: string; className?: string }) {
    const { direction } = useLanguage();
    const total = steps.length;
    const track = useRef<HTMLDivElement>(null);
    const frame = useRef<HTMLDivElement>(null);
    const rail = useRef<HTMLOListElement>(null);
    const [shift, setShift] = useState(0);
    const [active, setActive] = useState(0);
    const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });

    // How far the rail has to travel: its own width, less what the frame already shows. Measured, never guessed.
    useEffect(() => {
        const measure = () => {
            if (!rail.current || !frame.current) return;
            setShift(Math.max(0, rail.current.scrollWidth - frame.current.clientWidth));
        };
        const observer = new ResizeObserver(measure);
        if (rail.current) observer.observe(rail.current);
        if (frame.current) observer.observe(frame.current);
        return () => observer.disconnect();
    }, []);

    const sign = direction === "rtl" ? 1 : -1;
    const x = useTransform(scrollYProgress, [0.04, 0.96], [0, sign * shift]);
    const stride = total > 1 ? shift / (total - 1) : 0;

    useMotionValueEvent(scrollYProgress, "change", (value) => {
        const next = Math.min(total - 1, Math.max(0, Math.floor(value * total)));
        setActive((current) => (current === next ? current : next));
    });

    return (
        <div ref={track} className={cn("relative h-[340svh]", className)}>
            <div className="sticky top-0 flex h-svh flex-col justify-center gap-8 overflow-hidden py-20">
                <div ref={frame} className="w-full">
                    <motion.ol ref={rail} style={{ x }} className="flex w-max gap-6 ps-[max(1.5rem,calc((100vw-76rem)/2))] pe-[max(1.5rem,calc((100vw-76rem)/2))]">
                        {steps.map((step, index) => (
                            <Panel key={step[0]} step={step} index={index} label={label} railX={x} stride={stride} className="h-[clamp(27rem,66svh,33rem)] w-[min(82vw,62rem)] shrink-0" />
                        ))}
                    </motion.ol>
                </div>

                {/* Where you are in the journey: a gold thread and a count, in serif */}
                <div className="page-container w-full" aria-hidden>
                    <div className="flex items-center gap-5">
                        <span className={cn(SERIF, "text-[1.5rem] font-light tabular-nums text-ink")} dir="ltr">{pad(active + 1)}</span>
                        <span className="relative h-px flex-1 overflow-hidden bg-line-strong">
                            <motion.span style={{ scaleX: scrollYProgress }} className="absolute inset-0 origin-left bg-gold rtl:origin-right" />
                        </span>
                        <span className={cn(SERIF, "text-[1.5rem] font-light tabular-nums text-ink-soft")} dir="ltr">{pad(total)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const HowItWorks = () => {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.process;
    const steps = copy.steps as readonly Step[];
    const reduce = useReducedMotion();

    const stack = (
        <motion.ol variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className={cn("page-container space-y-5", !reduce && "lg:hidden")}>
            {steps.map((step, index) => (
                <Panel key={step[0]} step={step} index={index} label={copy.stepLabel} className="min-h-[24rem] sm:min-h-[22rem]" />
            ))}
        </motion.ol>
    );

    return (
        <section id="how-it-works" aria-labelledby="process-title" className={cn("section-pt relative isolate overflow-x-clip bg-canvas", CURTAIN)}>
            <div className="page-container">
                <SectionHeader variant="editorial" counter="05 / 06" id="process-title" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} />
            </div>

            <div className="mt-14 md:mt-20">
                {reduce ? (
                    stack
                ) : (
                    <>
                        <Journey steps={steps} label={copy.stepLabel} className="hidden lg:block" />
                        {stack}
                    </>
                )}
            </div>
            <div aria-hidden className="h-16 lg:h-24" />
        </section>
    );
};
