"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { BRAND } from "@/lib/config/brand";
import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Grain } from "./Atmosphere";
import { ACCENT_DARK, ACCENT_LIGHT, LABEL, SERIF } from "./typography";

type Tone = "light" | "deep";

function Word({ children, progress, range, accent, tone }: { children: string; progress: MotionValue<number>; range: [number, number]; accent: boolean; tone: Tone }) {
    const opacity = useTransform(progress, range, [0.16, 1]);
    return (
        <motion.span style={{ opacity }} className={cn("inline", accent && (tone === "deep" ? ACCENT_DARK : ACCENT_LIGHT))}>
            {children}
        </motion.span>
    );
}

/** A large ring that turns with the scroll, echoing the hero's orbit. */
function Ring({ progress, tone }: { progress: MotionValue<number>; tone: Tone }) {
    const rotate = useTransform(progress, [0, 1], [0, 140]);
    return (
        <motion.svg
            aria-hidden
            viewBox="0 0 800 800"
            style={{ rotate }}
            className={cn("pointer-events-none absolute left-1/2 top-1/2 size-[min(150vmin,64rem)] -translate-x-1/2 -translate-y-1/2", tone === "deep" ? "text-white/15" : "text-teal-300/60")}
        >
            <circle cx="400" cy="400" r="396" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="400" cy="400" r="300" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 10" />
            <circle cx="400" cy="400" r="210" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="400" cy="4" r="6" className="fill-gold" />
            <circle cx="106" cy="612" r="4.5" className={tone === "deep" ? "fill-teal-300" : "fill-teal-500"} />
        </motion.svg>
    );
}

/** One full statement layer. The light and deep layers share this so they stay aligned word for word. */
function Layer({ tone, eyebrow, words, read, ring, labelId }: { tone: Tone; eyebrow: string; words: string[]; read: MotionValue<number>; ring: MotionValue<number>; labelId?: string }) {
    const deep = tone === "deep";
    return (
        <div
            className={cn(
                "absolute inset-0 isolate flex items-center overflow-hidden",
                deep ? "bg-[linear-gradient(160deg,var(--color-teal-900),var(--color-ink)_92%)] text-white" : "bg-[radial-gradient(70%_60%_at_50%_0%,var(--color-teal-50),#ffffff_70%)] text-ink",
            )}
        >
            <Grain tone={deep ? "deep" : "light"} />
            <Ring progress={ring} tone={tone} />
            {deep ? <div aria-hidden className="pointer-events-none absolute -top-40 end-[-8%] -z-10 size-[30rem] rounded-full bg-gold/20 blur-3xl" /> : null}

            <div className="page-container">
                <div className="mx-auto max-w-5xl">
                    <p id={labelId} className={cn(LABEL, "flex items-center gap-3", deep ? "text-teal-200" : "text-teal-700")}>
                        <span aria-hidden className={cn("h-px w-10", deep ? "bg-gold-300" : "bg-gold")} />
                        {eyebrow}
                    </p>
                    <p className={cn(SERIF, "mt-8 text-[clamp(1.625rem,3.4vw+0.75rem,4.25rem)] font-light leading-[1.2] tracking-[-0.025em] rtl:leading-[1.55] rtl:tracking-normal")}>
                        {words.map((word, i) => (
                            <span key={`${word}-${i}`}>
                                <Word progress={read} range={[i / words.length, (i + 1) / words.length]} accent={word.includes(BRAND.name)} tone={tone}>
                                    {word}
                                </Word>
                                {i < words.length - 1 ? " " : null}
                            </span>
                        ))}
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * The brand statement as a scroll moment: it is read word by word on a light page, then a circle of
 * deep teal opens from the centre and carries the sentence into the dark. Static under reduced motion.
 */
export const StatementSection = () => {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.statement;
    const reduce = useReducedMotion();
    const track = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
    const words = copy.text.split(" ");

    const read = useTransform(scrollYProgress, [0.06, 0.58], [0, 1]);
    const radius = useTransform(scrollYProgress, [0.28, 0.78], [0, 150]);
    const clipPath = useMotionTemplate`circle(${radius}% at 50% 52%)`;
    const done = useMotionValue(1);

    if (reduce) {
        return (
            <section aria-labelledby="statement-eyebrow" className="relative h-[34rem] sm:h-[40rem]">
                <Layer tone="deep" eyebrow={copy.eyebrow} words={words} read={done} ring={done} labelId="statement-eyebrow" />
            </section>
        );
    }

    return (
        <section ref={track} aria-labelledby="statement-eyebrow" className="relative h-[280svh]">
            <div className="sticky top-0 h-svh overflow-hidden">
                <Layer tone="light" eyebrow={copy.eyebrow} words={words} read={read} ring={scrollYProgress} labelId="statement-eyebrow" />
                <motion.div aria-hidden style={{ clipPath }} className="absolute inset-0">
                    <Layer tone="deep" eyebrow={copy.eyebrow} words={words} read={read} ring={scrollYProgress} />
                </motion.div>
            </div>
        </section>
    );
};
