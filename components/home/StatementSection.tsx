"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { BRAND } from "@/lib/config/brand";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Grain } from "./Atmosphere";
import { ACCENT_LIGHT, LABEL, SERIF } from "./typography";

type Emphasis = "brand" | "key" | "plain";

/** The brand name is gold, the word that closes each sentence is the lighter teal, the rest is deep teal. */
function emphasisOf(word: string): Emphasis {
    if (word.includes(BRAND.name)) return "brand";
    return /[.!?؟]$/.test(word) ? "key" : "plain";
}

const EMPHASIS: Record<Emphasis, string> = {
    brand: ACCENT_LIGHT,
    key: "text-teal-600",
    plain: "text-teal-900",
};

function Word({ children, progress, range, emphasis }: { children: string; progress: MotionValue<number>; range: [number, number]; emphasis: Emphasis }) {
    const opacity = useTransform(progress, range, [0.14, 1]);
    return (
        <motion.span style={{ opacity }} className={cn("inline", EMPHASIS[emphasis])}>
            {children}
        </motion.span>
    );
}

/**
 * Two pools of light that drift with the scroll — pale aqua on the start side, champagne on the end side, like the logo —
 * over the section's vertical wash. Gradients only, no blur filter.
 */
function Light({ progress }: { progress: MotionValue<number> }) {
    const aquaX = useTransform(progress, [0, 1], ["-8%", "10%"]);
    const champagneX = useTransform(progress, [0, 1], ["8%", "-10%"]);
    const opacity = useTransform(progress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
    return (
        <motion.div aria-hidden style={{ opacity }} className="pointer-events-none absolute inset-0">
            <motion.span
                style={{ x: aquaX }}
                className="absolute -start-[18%] top-[12%] size-[min(70vmin,46rem)] bg-[radial-gradient(closest-side,rgb(134_186_188/0.34),transparent_72%)]"
            />
            <motion.span
                style={{ x: champagneX }}
                className="absolute -end-[18%] bottom-[8%] size-[min(78vmin,52rem)] bg-[radial-gradient(closest-side,rgb(230_213_170/0.55),transparent_72%)]"
            />
        </motion.div>
    );
}

/** A large ring that turns with the scroll, echoing the hero's orbit. Hairlines only — teal, with one gold dot. */
function Ring({ progress }: { progress: MotionValue<number> }) {
    const rotate = useTransform(progress, [0, 1], [0, 140]);
    return (
        <motion.svg
            aria-hidden
            viewBox="0 0 800 800"
            style={{ rotate }}
            className="pointer-events-none absolute left-1/2 top-1/2 size-[min(150vmin,64rem)] -translate-x-1/2 -translate-y-1/2 text-teal-400/45"
        >
            <circle cx="400" cy="400" r="396" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="400" cy="400" r="300" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 10" />
            <circle cx="400" cy="400" r="210" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="400" cy="4" r="6" className="fill-gold" />
            <circle cx="106" cy="612" r="4.5" className="fill-teal-500" />
        </motion.svg>
    );
}

/** One full statement layer: transparent, so the section's wash shows through; the sentence is read word by word. */
function Layer({ eyebrow, words, read, ring, labelId }: { eyebrow: string; words: string[]; read: MotionValue<number>; ring: MotionValue<number>; labelId?: string }) {
    return (
        <div className="absolute inset-0 isolate flex items-center overflow-hidden text-ink">
            <Light progress={ring} />
            <Grain tone="light" />
            <Ring progress={ring} />

            <div className="page-container">
                <div className="mx-auto max-w-5xl">
                    <p id={labelId} className={cn(LABEL, "flex items-center gap-3 text-teal-700")}>
                        <span aria-hidden className="h-px w-10 bg-gold" />
                        {eyebrow}
                    </p>
                    <p className={cn(SERIF, "mt-8 text-[clamp(1.625rem,3.4vw+0.75rem,4.25rem)] font-light leading-[1.2] tracking-[-0.025em] rtl:leading-[1.55] rtl:tracking-normal")}>
                        {words.map((word, i) => (
                            <span key={`${word}-${i}`}>
                                <Word progress={read} range={[i / words.length, (i + 1) / words.length]} emphasis={emphasisOf(word)}>
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

/** White at both ends, pale aqua then champagne in between: the page flows into and out of this section instead of jumping. */
const WASH = "bg-[linear-gradient(180deg,#ffffff_0%,rgb(221_237_239/0.9)_24%,rgb(241_248_248)_46%,rgb(246_238_216/0.9)_72%,#ffffff_100%)]";

/**
 * The brand statement as a scroll moment: it is read word by word over a vertical wash that runs from white into pale aqua
 * and champagne and back to white, while a hairline ring turns behind it. Static under reduced motion.
 */
export const StatementSection = () => {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.statement;
    const reduce = useReducedMotion();
    const track = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
    const words = copy.text.split(" ");

    const read = useTransform(scrollYProgress, [0.1, 0.72], [0, 1]);
    const done = useMotionValue(1);
    const rest = useMotionValue(0.5);

    if (reduce) {
        return (
            <section aria-labelledby="statement-eyebrow" className={cn("relative h-[34rem] sm:h-[40rem]", WASH)}>
                <Layer eyebrow={copy.eyebrow} words={words} read={done} ring={rest} labelId="statement-eyebrow" />
            </section>
        );
    }

    return (
        <section ref={track} aria-labelledby="statement-eyebrow" className={cn("relative h-[260svh]", WASH)}>
            <div className="sticky top-0 h-svh overflow-hidden">
                <Layer eyebrow={copy.eyebrow} words={words} read={read} ring={scrollYProgress} labelId="statement-eyebrow" />
            </div>
        </section>
    );
};
