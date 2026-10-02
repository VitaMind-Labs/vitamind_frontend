"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, REVEAL_VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import {
    AnimatePresence,
    motion,
    useMotionValueEvent,
    useScroll,
    useSpring,
    useTransform,
    type MotionValue,
} from "framer-motion";
import { Check } from "lucide-react";
import { useRef, useState } from "react";
import { pad } from "./accents";
import { Grain } from "./Atmosphere";
import { HomeSection } from "./HomeSection";
import { JOURNEY_VISUALS } from "./process/JourneyVisuals";
import { SectionHeader } from "./SectionHeader";
import { DISPLAY_S, LABEL, SERIF } from "./typography";

type Step = readonly [string, string, readonly string[]];
type StepState = "done" | "active" | "upcoming";

/** Maps the journey's scroll progress onto this step's own 0 → 1 slice. */
function StepVisual({ index, total, progress, details }: { index: number; total: number; progress: MotionValue<number>; details: readonly string[] }) {
    const local = useTransform(progress, [index / total, (index + 0.85) / total], [0, 1]);
    const Visual = JOURNEY_VISUALS[index];
    return <Visual progress={local} details={details} />;
}

const MARKER: Record<StepState, string> = {
    active: "border-teal-700 bg-teal-700 text-white shadow-brand",
    done: "border-teal-200 bg-teal-50 text-teal-700",
    upcoming: "border-line-strong bg-white text-ink-soft",
};

function ProcessStep({ step, index, state, stepLabel }: { step: Step; index: number; state: StepState; stepLabel: string }) {
    const active = state === "active";
    return (
        <motion.li
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={REVEAL_VIEWPORT}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            aria-current={active ? "step" : undefined}
            className="relative ps-16 pb-14 last:pb-0 sm:ps-20 lg:min-h-[clamp(16rem,38vh,22rem)] lg:pb-20"
        >
            <span
                aria-hidden
                className={cn(
                    "absolute start-0 top-0 flex size-12 items-center justify-center rounded-full border text-[0.9375rem] font-medium tabular-nums transition-[background-color,border-color,color,box-shadow] duration-700 ease-out-soft",
                    MARKER[state],
                )}
            >
                {state === "done" ? <Check className="h-4 w-4" strokeWidth={2.25} /> : pad(index + 1)}
            </span>

            <p className={cn(LABEL, "pt-1 text-gold-700")}>
                {stepLabel} {pad(index + 1)}
            </p>
            <h3 className={cn(DISPLAY_S, "mt-3 text-[clamp(1.75rem,1.4vw+1.3rem,2.5rem)] transition-colors duration-700", active ? "text-ink" : "text-ink-soft")}>
                {step[0]}
            </h3>
            <p className="mt-4 max-w-lg text-[1.0625rem] leading-8 text-ink-soft">{step[1]}</p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
                {step[2].map((detail) => (
                    <li
                        key={detail}
                        className={cn(
                            "rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors duration-700",
                            active ? "border-teal-200 bg-teal-50 text-teal-800" : "border-line bg-white/70 text-ink-soft",
                        )}
                    >
                        {detail}
                    </li>
                ))}
            </ul>
        </motion.li>
    );
}

export const HowItWorks = () => {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.process;
    const steps = copy.steps as readonly Step[];
    const total = steps.length;

    const listRef = useRef<HTMLOListElement>(null);
    const [active, setActive] = useState(0);
    // The reading line sits at 55% of the viewport: the step crossing it is the active one.
    const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.55", "end 0.55"] });
    const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        const next = Math.min(total - 1, Math.max(0, Math.floor(v * total)));
        setActive((current) => (current === next ? current : next));
    });

    const stateOf = (i: number): StepState => (i < active ? "done" : i === active ? "active" : "upcoming");

    return (
        <HomeSection id="how-it-works" labelledBy="process-title">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
                {/* ── Context column: sticky on desktop ─────────────────────── */}
                <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-28">
                        <SectionHeader variant="editorial" id="process-title" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} />

                        <div className="mt-12 hidden items-center gap-5 lg:flex" aria-hidden>
                            <span className={cn(SERIF, "text-2xl font-light tabular-nums text-ink")}>{pad(active + 1)}</span>
                            <span className="relative h-px flex-1 overflow-hidden bg-line-strong">
                                <motion.span style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-gold rtl:origin-right" />
                            </span>
                            <span className={cn(SERIF, "text-2xl font-light tabular-nums text-ink-soft")}>{pad(total)}</span>
                        </div>

                        <div
                            aria-hidden
                            className="relative isolate mt-6 hidden h-[clamp(17rem,calc(100vh-24rem),26rem)] overflow-hidden rounded-panel border border-line bg-[radial-gradient(80%_70%_at_20%_0%,var(--color-teal-100),transparent_70%),linear-gradient(160deg,#ffffff,var(--color-teal-50))] shadow-[var(--shadow-soft)] lg:block"
                        >
                            <Grain tone="light" />
                            {/* The step number, enormous and faint, changes with the step */}
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.span
                                    key={`ghost-${active}`}
                                    initial={{ opacity: 0, y: 36 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -36 }}
                                    transition={{ duration: 0.8, ease: EASE_OUT }}
                                    className={cn(SERIF, "pointer-events-none absolute -bottom-8 end-6 select-none text-[11rem] font-extralight leading-none tabular-nums text-teal-700/10")}
                                >
                                    {pad(active + 1)}
                                </motion.span>
                            </AnimatePresence>
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.div
                                    key={active}
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    transition={{ duration: 0.8, ease: EASE_OUT }}
                                    className="absolute inset-0 p-8"
                                >
                                    <StepVisual index={active} total={total} progress={progress} details={steps[active][2]} />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* ── The journey: one list for every breakpoint ────────────── */}
                <div className="lg:col-span-6 lg:col-start-7 lg:pt-4">
                    <ol ref={listRef} className="relative">
                        <span aria-hidden className="absolute bottom-10 start-[calc(1.25rem-0.5px)] top-10 w-px bg-line" />
                        <motion.span
                            aria-hidden
                            style={{ scaleY: progress }}
                            className="absolute bottom-10 start-[calc(1.25rem-0.5px)] top-10 w-px origin-top bg-teal-500"
                        />
                        {steps.map((step, i) => (
                            <ProcessStep key={step[0]} step={step} index={i} state={stateOf(i)} stepLabel={copy.stepLabel} />
                        ))}
                    </ol>
                </div>
            </div>
        </HomeSection>
    );
};
