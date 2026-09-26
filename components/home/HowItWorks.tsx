"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, REVEAL_VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import {
    AnimatePresence,
    animate,
    motion,
    useInView,
    useMotionValue,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
    type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { JOURNEY_VISUALS } from "./process/JourneyVisuals";
import { SectionHeader } from "./SectionHeader";

type Step = readonly [string, string, readonly string[]];
const pad = (n: number) => String(n).padStart(2, "0");

/* The journey "vine": a calm wave with four stations, drawn as the reader scrolls. */
const VINE: [number, number][] = [[0, 70], [150, 40], [300, 78], [450, 36], [600, 70], [750, 34], [900, 74], [1050, 38], [1200, 62]];
const STATIONS = [1, 3, 5, 7] as const;
const VINE_PATH = VINE.reduce((d, p, i, all) => {
    if (i === 0) return `M ${p[0]} ${p[1]}`;
    const p0 = all[i - 2] ?? all[i - 1];
    const p1 = all[i - 1];
    const p3 = all[i + 1] ?? p;
    return `${d} C ${p1[0] + (p[0] - p0[0]) / 6} ${p1[1] + (p[1] - p0[1]) / 6}, ${p[0] - (p3[0] - p1[0]) / 6} ${p[1] - (p3[1] - p1[1]) / 6}, ${p[0]} ${p[1]}`;
}, "");

function Station({ progress, index, total }: { progress: MotionValue<number>; index: number; total: number }) {
    const [x, y] = VINE[STATIONS[index]];
    const reached = (index + 0.5) / total;
    const scale = useTransform(progress, [reached - 0.06, reached], [0.4, 1]);
    const fill = useTransform(progress, [reached - 0.06, reached], ["#ffffff", "#518591"]);
    return (
        <motion.g style={{ scale, transformOrigin: `${x}px ${y}px` }}>
            <circle cx={x} cy={y} r="16" fill="var(--color-teal-500)" opacity="0.12" />
            <motion.circle cx={x} cy={y} r="7" style={{ fill }} stroke="var(--color-teal-500)" strokeWidth="2.5" />
        </motion.g>
    );
}

function Vine({ progress, total }: { progress: MotionValue<number>; total: number }) {
    return (
        <svg viewBox="0 0 1200 110" preserveAspectRatio="none" className="h-full w-full overflow-visible rtl:-scale-x-100" aria-hidden>
            <path d={VINE_PATH} fill="none" stroke="var(--color-line-strong)" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" />
            <motion.path d={VINE_PATH} fill="none" stroke="url(#vine-gradient)" strokeWidth="3" strokeLinecap="round" style={{ pathLength: progress }} />
            <defs>
                <linearGradient id="vine-gradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="var(--color-teal-500)" />
                    <stop offset="70%" stopColor="var(--color-sage)" />
                    <stop offset="100%" stopColor="var(--color-gold)" />
                </linearGradient>
            </defs>
            {Array.from({ length: total }, (_, i) => (
                <Station key={i} progress={progress} index={i} total={total} />
            ))}
        </svg>
    );
}

/** Maps the section's scroll progress onto this step's own 0 → 1 slice (clamped). */
function StepVisual({ index, total, progress, details }: { index: number; total: number; progress: MotionValue<number>; details: readonly string[] }) {
    const local = useTransform(progress, [index / total, (index + 0.85) / total], [0, 1]);
    const Visual = JOURNEY_VISUALS[index];
    return <Visual progress={local} details={details} />;
}

/* ───────────────────────── Desktop: pinned journey ───────────────────────── */

function PinnedJourney({ steps, stepLabel }: { steps: readonly Step[]; stepLabel: string }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
    const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.3 });
    const [active, setActive] = useState(0);
    const total = steps.length;

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        setActive(Math.min(total - 1, Math.max(0, Math.floor(v * total))));
    });

    const glowX = useTransform(progress, [0, 1], ["-10%", "55%"]);
    const step = steps[active];

    const goTo = (index: number) => {
        const el = trackRef.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const scrollable = el.offsetHeight - window.innerHeight;
        window.scrollTo({ top: top + ((index + 0.5) / total) * scrollable, behavior: reduce ? "auto" : "smooth" });
    };

    return (
        <div ref={trackRef} className="relative hidden lg:block" style={{ height: `${total * 90 + 60}vh` }}>
            {/* Screen readers get every step, independent of scroll position. */}
            <ol className="sr-only">
                {steps.map((s, i) => (
                    <li key={s[0]}>
                        {stepLabel} {i + 1}: {s[0]}. {s[1]} {s[2].join(", ")}.
                    </li>
                ))}
            </ol>

            <div className="sticky top-0 flex h-screen items-center pt-20" aria-hidden>
                <div className="page-container">
                    <div className="relative isolate h-[min(42rem,calc(100vh-8rem))] overflow-hidden rounded-[2.5rem] border border-line bg-[linear-gradient(160deg,#ffffff,var(--color-canvas)_45%,var(--color-teal-50))] shadow-float">
                        {/* Atmosphere */}
                        <motion.div style={{ left: glowX }} className="pointer-events-none absolute -top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-teal-200/45 blur-3xl" />
                        <div
                            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
                            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, var(--color-line-strong) 1px, transparent 0)", backgroundSize: "26px 26px", maskImage: "linear-gradient(to bottom, black, transparent 85%)" }}
                        />

                        <div className="grid h-full grid-cols-[minmax(0,5fr)_minmax(0,7fr)] grid-rows-[auto_minmax(0,1fr)_auto]">
                            {/* Step rail */}
                            <div className="col-span-2 flex items-center gap-2 px-10 pt-8 xl:px-12">
                                {steps.map((s, i) => (
                                    <button
                                        key={s[0]}
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => goTo(i)}
                                        className={cn(
                                            "group flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-2 text-sm transition-colors duration-300",
                                            i === active ? "bg-ink text-white shadow-raised" : "text-ink-muted hover:bg-white hover:text-ink",
                                        )}
                                    >
                                        <span className={cn("tabular-nums text-xs font-semibold", i === active ? "text-gold-300" : i < active ? "text-teal-600" : "text-ink-subtle")}>{pad(i + 1)}</span>
                                        <span className="font-medium">{s[0]}</span>
                                    </button>
                                ))}
                                <span className="ms-auto text-xs font-medium tabular-nums text-ink-muted">
                                    {pad(active + 1)} <span className="text-ink-subtle">/ {pad(total)}</span>
                                </span>
                            </div>

                            {/* Narrative */}
                            <div className="relative flex min-h-0 flex-col justify-center px-10 xl:px-12">
                                <div className="relative h-[clamp(5.5rem,11vw,9.5rem)] overflow-hidden">
                                    <AnimatePresence mode="popLayout" initial={false}>
                                        <motion.span
                                            key={active}
                                            initial={{ y: "100%", opacity: 0 }}
                                            animate={{ y: "0%", opacity: 1 }}
                                            exit={{ y: "-100%", opacity: 0 }}
                                            transition={{ duration: 0.7, ease: EASE_OUT }}
                                            className="home-heading-accent absolute inset-x-0 top-0 block text-[clamp(5rem,10vw,9rem)] font-extralight leading-none tracking-[-0.05em] tabular-nums"
                                        >
                                            {pad(active + 1)}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>

                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={active}
                                        initial="hidden"
                                        animate="show"
                                        exit="exit"
                                        variants={{
                                            hidden: {},
                                            show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                                            exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
                                        }}
                                    >
                                        <motion.p
                                            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } } }}
                                            className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-700"
                                        >
                                            {stepLabel} {pad(active + 1)}
                                        </motion.p>
                                        <motion.h3
                                            variants={{ hidden: { opacity: 0, y: 24, filter: "blur(6px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.65, ease: EASE_OUT } } }}
                                            className="mt-3 text-heading font-light tracking-[-0.03em] text-ink"
                                        >
                                            {step[0]}
                                        </motion.h3>
                                        <motion.p
                                            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } } }}
                                            className="home-body mt-5 max-w-md"
                                        >
                                            {step[1]}
                                        </motion.p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Visual stage */}
                            <div className="relative row-span-1 min-h-0 p-6 pe-10 xl:pe-12">
                                <div className="relative h-full overflow-hidden rounded-[2rem] border border-white bg-white/70 shadow-card ring-1 ring-line backdrop-blur-sm">
                                    <AnimatePresence mode="popLayout" initial={false}>
                                        <motion.div
                                            key={active}
                                            initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
                                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                            exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
                                            transition={{ duration: 0.6, ease: EASE_OUT }}
                                            className="absolute inset-0 p-8"
                                        >
                                            <StepVisual index={active} total={total} progress={progress} details={step[2]} />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Vine */}
                            <div className="col-span-2 h-24 px-10 pb-6 xl:px-12">
                                <Vine progress={progress} total={total} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ───────────────────────── Mobile & tablet: journey cards ───────────────────────── */

function JourneyCard({ step, index, total, stepLabel }: { step: Step; index: number; total: number; stepLabel: string }) {
    const ref = useRef<HTMLLIElement>(null);
    const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
    const reduce = useReducedMotion();
    const progress = useMotionValue(reduce ? 1 : 0);
    const Visual = JOURNEY_VISUALS[index];

    useEffect(() => {
        if (!inView || reduce) return;
        const controls = animate(progress, 1, { duration: 2.2, ease: EASE_OUT, delay: 0.2 });
        return () => controls.stop();
    }, [inView, reduce, progress]);

    return (
        <motion.li
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={REVEAL_VIEWPORT}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="relative ps-10 sm:ps-14"
        >
            {/* Timeline */}
            <span aria-hidden className="absolute start-[0.6875rem] top-0 h-full w-px bg-line sm:start-[1.1875rem]" />
            <span aria-hidden className={cn("absolute start-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white sm:start-2", index === total - 1 ? "border-gold" : "border-teal-500")}>
                <span className="h-2 w-2 rounded-full bg-teal-500" />
            </span>

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-700">
                {stepLabel} {pad(index + 1)}
            </p>
            <h3 className="mt-2 text-title font-medium tracking-[-0.02em] text-ink">{step[0]}</h3>
            <p className="home-body mt-3">{step[1]}</p>
            <div className="mt-6 h-72 overflow-hidden rounded-[1.75rem] border border-line bg-[linear-gradient(160deg,#ffffff,var(--color-teal-50))] p-5 shadow-card sm:h-80" aria-hidden>
                <Visual progress={progress} details={step[2]} />
            </div>
        </motion.li>
    );
}

export const HowItWorks = () => {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.process;
    const steps = copy.steps as readonly Step[];

    return (
        <section id="how-it-works" className="relative bg-white pt-[clamp(4.5rem,8vw,8.5rem)] lg:pb-16">
            <div className="page-container">
                <SectionHeader
                    align="center"
                    eyebrow={copy.eyebrow}
                    icon={<span aria-hidden className="h-px w-5 bg-gold" />}
                    titleA={copy.titleA}
                    titleB={copy.titleB}
                />
            </div>

            <PinnedJourney steps={steps} stepLabel={copy.stepLabel} />

            <div className="page-container pb-[clamp(4.5rem,8vw,8.5rem)] lg:hidden">
                <ol className="mx-auto mt-12 max-w-xl space-y-14">
                    {steps.map((step, i) => (
                        <JourneyCard key={step[0]} step={step} index={i} total={steps.length} stepLabel={copy.stepLabel} />
                    ))}
                </ol>
            </div>
        </section>
    );
};
