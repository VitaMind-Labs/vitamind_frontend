"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { BRAND } from "@/lib/config/brand";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

function Word({ children, progress, range, accent }: { children: string; progress: MotionValue<number>; range: [number, number]; accent: boolean }) {
    const reduce = useReducedMotion();
    const opacity = useTransform(progress, range, [reduce ? 1 : 0.16, 1]);
    return (
        <motion.span style={{ opacity }} className={cn("inline", accent && "home-heading-accent font-normal")}>
            {children}
        </motion.span>
    );
}

/** A single brand statement, read word-by-word as it scrolls through the viewport. */
export const StatementSection = () => {
    const ref = useRef<HTMLParagraphElement>(null);
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.statement;
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
    const words = copy.text.split(" ");

    return (
        <section aria-labelledby="statement-eyebrow" className="section-y relative bg-white">
            <div className="page-container">
                <div className="mx-auto max-w-5xl">
                    <p id="statement-eyebrow" className="home-eyebrow flex items-center gap-3">
                        <span aria-hidden className="h-px w-10 bg-gold" />
                        {copy.eyebrow}
                    </p>
                    <p ref={ref} className="mt-8 text-[clamp(1.75rem,2.6vw+1rem,3.5rem)] font-light leading-[1.28] tracking-[-0.025em] text-ink">
                        {words.map((word, i) => (
                            <span key={`${word}-${i}`}>
                                <Word progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} accent={word.includes(BRAND.name)}>
                                    {word}
                                </Word>
                                {i < words.length - 1 ? " " : null}
                            </span>
                        ))}
                    </p>
                </div>
            </div>
        </section>
    );
};
