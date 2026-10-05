"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { BRAND } from "@/lib/config/brand";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { pad } from "./accents";
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
    const [from, to] = range;
    const opacity = useTransform(progress, [from, to], [0.12, 1]);
    const y = useTransform(progress, [from, to], ["72%", "0%"]);
    const line = useTransform(progress, [to, Math.min(1, to + 0.035)], [0, 1]);
    const marked = emphasis !== "plain";

    return (
        <span className="relative inline-block">
            {/* The mask is padded and pulled back so italics and descenders never clip. */}
            <span className="-mx-[0.08em] -my-[0.14em] inline-block overflow-hidden px-[0.08em] py-[0.14em] align-bottom">
                <motion.span style={{ opacity, y }} className={cn("inline-block", EMPHASIS[emphasis])}>
                    {children}
                </motion.span>
            </span>
            {marked ? (
                <motion.span
                    aria-hidden
                    style={{ scaleX: line }}
                    className={cn("pointer-events-none absolute inset-x-0 -bottom-[0.04em] h-px origin-left rtl:origin-right", emphasis === "brand" ? "bg-gold" : "bg-teal-400/70")}
                />
            ) : null}
        </span>
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

/**
 * The circle system, as an aperture: concentric hairline rings that open as the statement is read and turn against one another,
 * a dial of ticks, small points riding two of the rings, and a lens of light at the centre that swells with the reading.
 * Hairlines only — teal, with gold points. Always centred on the text.
 */
function Ring({ progress }: { progress: MotionValue<number> }) {
    const outer = useTransform(progress, [0, 1], [0, 150]);
    const inner = useTransform(progress, [0, 1], [0, -210]);
    const open = useTransform(progress, [0, 0.45, 1], [0.8, 1, 1.06]);
    const lens = useTransform(progress, [0, 0.5, 1], [0.55, 1, 0.8]);
    const lensGlow = useTransform(progress, [0, 0.2, 0.7, 1], [0, 0.9, 0.9, 0]);

    return (
        <motion.div aria-hidden style={{ scale: open }} className="pointer-events-none absolute inset-0 grid place-items-center">
            <motion.span
                style={{ scale: lens, opacity: lensGlow }}
                className="absolute size-[min(62vmin,36rem)] rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.85),rgb(191_221_225/0.35)_55%,transparent_75%)]"
            />
            <div className="relative size-[min(150vmin,64rem)] text-teal-400/45">
                <motion.svg viewBox="0 0 800 800" style={{ rotate: outer }} className="absolute inset-0 size-full">
                    <circle cx="400" cy="400" r="396" fill="none" stroke="currentColor" strokeWidth="1" />
                    {/* The dial: 72 radial ticks */}
                    <circle cx="400" cy="400" r="352" fill="none" stroke="currentColor" strokeWidth="9" strokeDasharray="1.2 29.8" />
                    <circle cx="400" cy="400" r="300" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 10" />
                    <circle cx="400" cy="4" r="6" className="fill-gold" />
                    <circle cx="106" cy="612" r="4.5" className="fill-teal-500" />
                </motion.svg>
                <motion.svg viewBox="0 0 800 800" style={{ rotate: inner }} className="absolute inset-0 size-full">
                    <circle cx="400" cy="400" r="236" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="400" cy="400" r="176" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1 7" />
                    <circle cx="400" cy="400" r="116" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="636" cy="400" r="5" className="fill-gold" />
                    <circle cx="400" cy="224" r="3.5" className="fill-teal-500" />
                </motion.svg>
            </div>
        </motion.div>
    );
}

/** Cuts the words into sentences, keeping each word's place in the whole so the reading progress stays continuous. */
function toSentences(words: string[]) {
    const sentences: { start: number; words: string[] }[] = [];
    let current: { start: number; words: string[] } = { start: 0, words: [] };
    words.forEach((word, i) => {
        current.words.push(word);
        if (/[.!?؟]$/.test(word) || i === words.length - 1) {
            sentences.push(current);
            current = { start: i + 1, words: [] };
        }
    });
    return sentences;
}

/**
 * One sentence, centred. It rises into place as the reading reaches it, sits a touch larger while it is the one being read,
 * then settles back and quietens once the next one begins — so on a phone, where only a few lines fit, the eye always knows where it is.
 */
function Sentence({ progress, from, to, last, index, children }: { progress: MotionValue<number>; from: number; to: number; last: boolean; index: string; children: ReactNode }) {
    const y = useTransform(progress, [Math.max(0, from - 0.07), from], [28, 0]);
    const scale = useTransform(progress, [Math.max(0, from - 0.05), from, to, Math.min(1, to + 0.06)], [0.94, 1, 1, last ? 1 : 0.97]);
    const opacity = useTransform(progress, [to, Math.min(1, to + 0.08)], [1, last ? 1 : 0.5]);

    return (
        <motion.p style={{ y, scale, opacity }} className="mx-auto max-w-[19ch] text-balance min-[430px]:max-w-[23ch] sm:max-w-[26ch] lg:max-w-[30ch]">
            <span aria-hidden dir="ltr" className="mb-3 flex items-center justify-center gap-3 font-mono text-[0.75rem] font-normal leading-none tabular-nums tracking-normal text-gold-700 sm:mb-4">
                <span className="h-px w-6 bg-gold/60" />
                {index}
                <span className="h-px w-6 bg-gold/60" />
            </span>
            {children}
        </motion.p>
    );
}

/** Where you are in the statement: one dot per sentence, the current one stretched into a gold bar. */
function Dots({ count, active }: { count: number; active: number }) {
    return (
        <div aria-hidden className="mt-9 flex items-center justify-center gap-2 sm:mt-12">
            {Array.from({ length: count }, (_, i) => (
                <span key={i} className={cn("h-1.5 rounded-full transition-[width,background-color] duration-500 ease-out-soft", i === active ? "w-8 bg-gold" : i < active ? "w-1.5 bg-teal-500" : "w-1.5 bg-teal-900/20")} />
            ))}
        </div>
    );
}

/** One full statement layer: transparent, so the section's wash shows through; centred, read sentence by sentence, word by word. */
function Layer({ eyebrow, words, read, ring, labelId }: { eyebrow: string; words: string[]; read: MotionValue<number>; ring: MotionValue<number>; labelId?: string }) {
    const sentences = toSentences(words);
    const [active, setActive] = useState(0);

    useMotionValueEvent(read, "change", (value) => {
        const at = Math.min(words.length - 1, Math.max(0, Math.floor(value * words.length)));
        const next = Math.max(0, sentences.findIndex((s) => at < s.start + s.words.length));
        setActive((current) => (current === next ? current : next));
    });

    return (
        <div className="absolute inset-0 isolate flex items-center overflow-hidden py-14 text-ink sm:py-20">
            <Light progress={ring} />
            <Grain tone="light" />
            <Ring progress={ring} />

            <div className="page-container relative">
                <div className="mx-auto max-w-5xl text-center">
                    <div className="flex flex-col items-center gap-4">
                        <span aria-hidden dir="ltr" className="rounded-full border border-line-strong bg-white/60 px-3 py-1 font-mono text-[0.75rem] tabular-nums leading-none text-ink-soft backdrop-blur-sm">
                            {pad(active + 1)} / {pad(sentences.length)}
                        </span>
                        <p id={labelId} className={cn(LABEL, "flex items-center justify-center gap-3 text-teal-700")}>
                            <span aria-hidden className="h-px w-8 bg-gold sm:w-10" />
                            {eyebrow}
                            <span aria-hidden className="h-px w-8 bg-gold sm:w-10" />
                        </p>
                        <span aria-hidden className="relative h-px w-[min(14rem,56%)] overflow-hidden bg-teal-900/15">
                            <motion.span style={{ scaleX: read }} className="absolute inset-0 origin-left bg-gold rtl:origin-right" />
                        </span>
                    </div>

                    <div className={cn(SERIF, "mt-8 space-y-[0.5em] text-[clamp(1.5rem,3.4vw+0.75rem,4.5rem)] font-light leading-[1.14] tracking-[-0.03em] rtl:leading-[1.55] rtl:tracking-normal sm:mt-10")}>
                        {sentences.map((sentence, s) => (
                            <Sentence
                                key={sentence.start}
                                progress={read}
                                from={sentence.start / words.length}
                                to={(sentence.start + sentence.words.length) / words.length}
                                last={s === sentences.length - 1}
                                index={pad(s + 1)}
                            >
                                {sentence.words.map((word, w) => {
                                    const i = sentence.start + w;
                                    return (
                                        <span key={`${word}-${i}`}>
                                            <Word progress={read} range={[i / words.length, (i + 1) / words.length]} emphasis={emphasisOf(word)}>
                                                {word}
                                            </Word>
                                            {w < sentence.words.length - 1 ? " " : null}
                                        </span>
                                    );
                                })}
                            </Sentence>
                        ))}
                    </div>

                    <Dots count={sentences.length} active={active} />
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
            <section aria-labelledby="statement-eyebrow" className={cn("relative h-[46rem] sm:h-[44rem]", WASH)}>
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
