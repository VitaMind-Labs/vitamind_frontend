"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePlans } from "@/hooks/usePlans";
import { REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Check, CircleAlert, Lock } from "lucide-react";
import { useRef } from "react";
import { HomeSection } from "./HomeSection";
import { TiltCard } from "./Interactions";
import { HomePlanCard, HomePlanSkeleton } from "./PlanCard";
import { SectionHeader } from "./SectionHeader";

/** Quiet orbit lines behind the offer: two hairline rings turning against each other. */
export function Orbits() {
    const reduce = useReducedMotion();
    return (
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[min(48rem,140%)] -translate-x-1/2 -translate-y-1/2">
            {[100, 76].map((size, i) => (
                <motion.span
                    key={size}
                    className="absolute left-1/2 top-1/2 rounded-full border border-teal-300/60"
                    style={{ width: `${size}%`, height: `${size}%`, marginLeft: `${-size / 2}%`, marginTop: `${-size / 2}%`, borderStyle: i === 1 ? "dashed" : "solid" }}
                    animate={reduce ? undefined : { rotate: i === 1 ? -360 : 360 }}
                    transition={{ duration: 120 - i * 30, repeat: Infinity, ease: "linear" }}
                >
                    <span className={`absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${i === 0 ? "bg-gold" : "bg-teal-400"}`} />
                </motion.span>
            ))}
        </div>
    );
}

/** The same plan as /subscription — one card from the database, not a separate marketing table. */
export const Pricing = () => {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.pricing;
    const sub = dictionary.subscription;
    const plans = usePlans();
    const plan = plans.plan;
    const reduce = useReducedMotion();

    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const glowY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 70, reduce ? 0 : -70]);

    const reassurance = [
        { icon: Lock, text: copy.secure },
        { icon: Check, text: copy.trial },
        { icon: Check, text: copy.cancel },
    ];

    return (
        <HomeSection id="pricing" labelledBy="pricing-title" tone="tint">
            <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
                {/* ── Words on the left, held in place while the offer is considered ───────── */}
                <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
                    <SectionHeader variant="editorial" id="pricing-title" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} intro={copy.intro} />

                    <motion.ul variants={stagger(0.1, 0.2)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className="mt-10 divide-y divide-line-strong/70 border-y border-line-strong/70">
                        {reassurance.map(({ icon: Icon, text }) => (
                            <motion.li key={text} variants={fadeUp(0, 12)} className="flex items-center gap-4 py-4 text-[1rem] text-ink">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-teal-200 bg-white text-teal-700">
                                    <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                                </span>
                                {text}
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>

                {/* ── The offer: a deep-teal mat that leans toward the pointer ────────────── */}
                <div ref={ref} className="relative lg:col-span-7">
                    <motion.span
                        aria-hidden
                        style={{ y: glowY }}
                        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(227_176_28/0.28),rgb(81_133_145/0.16)_55%,transparent)] blur-2xl"
                    />
                    <Orbits />

                    <motion.div variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT}>
                        {plan ? (
                            <TiltCard className="mx-auto max-w-xl">
                                <HomePlanCard plan={plan} href="/subscription" />
                            </TiltCard>
                        ) : plans.isLoading ? (
                            <HomePlanSkeleton />
                        ) : (
                            <motion.div
                                variants={fadeUp(0, 16)}
                                role="alert"
                                className="mx-auto flex w-full max-w-xl flex-col items-center gap-3 rounded-panel border border-rose-100 bg-rose-50 p-8 text-center"
                            >
                                <CircleAlert className="h-6 w-6 text-rose-700" aria-hidden />
                                <p className="font-semibold text-ink">{sub.plansUnavailableTitle}</p>
                                <p className="text-[0.9375rem] text-ink-soft">{sub.plansUnavailableBody}</p>
                                <Button variant="outline" onClick={() => void plans.refresh()}>
                                    {sub.retry}
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </HomeSection>
    );
};
