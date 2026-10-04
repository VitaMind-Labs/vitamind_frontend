"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ApiPlan } from "@/lib/api/billing";
import { planFeatureLines, tierCopyKey } from "@/lib/config/plans";
import { REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { Grain } from "./Atmosphere";
import { CountUp } from "./CountUp";
import { DISPLAY_S, LABEL, SERIF } from "./typography";

/** Currency symbol + figure, with digits kept Latin in Arabic too (same rule as the rest of billing). */
export function splitPrice(price: number, currency: string) {
    const parts = new Intl.NumberFormat("en-US", { style: "currency", currency, numberingSystem: "latn", minimumFractionDigits: 0, maximumFractionDigits: 2 }).formatToParts(price);
    return {
        symbol: parts.filter((part) => part.type === "currency").map((part) => part.value).join(""),
        figure: parts.filter((part) => part.type !== "currency" && part.type !== "literal").map((part) => part.value).join(""),
    };
}

/**
 * The home page's offer: the same plan, from the same database call, as /subscription — presented as one
 * deep-teal object with a hairline gold edge. Data and copy are identical; only the dressing differs.
 */
export function HomePlanCard({ plan, href, ownsIt = false, needsRenewal = false }: { plan: ApiPlan; href: string; ownsIt?: boolean; needsRenewal?: boolean }) {
    const { dictionary } = useLanguage();
    const reduce = useReducedMotion();
    const copy = dictionary.subscription;
    const tierCopy = copy[tierCopyKey(plan.tier)];
    // The trial length is the badge above the price, so it is not repeated in the list.
    const lines = planFeatureLines(plan, copy.planFeature);
    const features = plan.trialDays > 0 ? lines.slice(0, -1) : lines;
    const { symbol, figure } = splitPrice(plan.price, plan.currency);

    return (
        <motion.article
            aria-labelledby="plan-title"
            variants={stagger(0.07, 0.15)}
            initial="hidden"
            whileInView="show"
            viewport={REVEAL_VIEWPORT}
            // A 1px gradient edge: gold where the light lands, teal where it falls away.
            className="relative mx-auto w-full max-w-xl rounded-[2.25rem] bg-[linear-gradient(135deg,rgb(201_175_111/0.75),rgb(91_144_145/0.35)_45%,rgb(201_175_111/0.2))] p-px shadow-float"
        >
            <div className="relative isolate overflow-hidden rounded-[calc(2.25rem-1px)] bg-deep p-7 text-white sm:p-10">
                <Grain />

                {/* A slow sheen crosses the surface now and then */}
                {reduce ? null : (
                    <motion.span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 -z-10 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
                        initial={{ left: "-40%" }}
                        animate={{ left: ["-40%", "140%"] }}
                        transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 6, ease: "easeInOut" }}
                    />
                )}

                <motion.div variants={fadeUp(0, 14)} className="flex items-center justify-between gap-3">
                    <h3 id="plan-title" className={cn(DISPLAY_S, "text-white")}>
                        {tierCopy.name}
                    </h3>
                    {ownsIt ? (
                        <span className={cn(LABEL, "inline-flex items-center gap-2 rounded-full border border-sage/50 bg-sage/15 px-3 py-1.5 text-white")}>
                            <span aria-hidden className="size-1.5 rounded-full bg-sage" />
                            {copy.currentPlan}
                        </span>
                    ) : (
                        <span className={cn(LABEL, "inline-flex items-center gap-2 rounded-full border border-gold-300/40 bg-gold/10 px-3 py-1.5 text-gold-300")}>
                            <span aria-hidden className="size-1.5 rounded-full bg-gold" />
                            {plan.trialDays > 0 ? copy.planFeature.trial.replace("{n}", String(plan.trialDays)) : copy.perMonth}
                        </span>
                    )}
                </motion.div>

                <motion.p variants={fadeUp(0, 14)} className="mt-9 flex items-baseline gap-2" dir="ltr">
                    <span className={cn(SERIF, "text-[clamp(1.5rem,1.5vw+1rem,2.25rem)] font-light text-gold-300")}>{symbol}</span>
                    <span className={cn(SERIF, "text-[clamp(4rem,6vw+1.5rem,6.5rem)] font-light leading-none tracking-[-0.045em] tabular-nums")}>
                        <CountUp value={figure} />
                    </span>
                    <span className="ms-2 text-[0.9375rem] text-teal-100" dir="auto">
                        {copy.perMonth}
                    </span>
                </motion.p>

                <motion.p variants={fadeUp(0, 14)} className={cn("mt-6 max-w-md text-[1.0625rem] leading-[1.7] text-teal-100")}>
                    {tierCopy.desc}
                </motion.p>

                <motion.ul variants={stagger(0.06)} className="mt-8 space-y-4 border-t border-white/15 pt-8">
                    {features.map((feature) => (
                        <motion.li key={feature} variants={fadeUp(0, 10)} className="flex items-start gap-3.5">
                            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-gold-300/40 bg-gold/15 text-gold-300">
                                <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
                            </span>
                            <span className="min-w-0 text-[1rem] leading-6 text-white/90">{feature}</span>
                        </motion.li>
                    ))}
                </motion.ul>

                <motion.div variants={fadeUp(0, 14)} className="mt-10">
                    {ownsIt ? (
                        <Button size="lg" variant="outline" disabled className="min-h-14 w-full border-white/25 bg-white/5 text-white">
                            {copy.currentPlan}
                        </Button>
                    ) : (
                        <Button
                            asChild
                            size="lg"
                            className="group relative min-h-14 w-full overflow-hidden bg-white text-ink shadow-[0_22px_44px_-18px_rgb(0_0_0/0.6)] hover:bg-white hover:text-ink focus-visible:ring-offset-ink"
                        >
                            <Link href={href}>
                                {/* Warmth rises from the bottom edge on hover */}
                                <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-gold-300 transition-transform duration-500 ease-out-soft group-hover:scale-y-100" />
                                <span className="relative flex items-center gap-2.5">
                                    {needsRenewal ? copy.renewPlan : tierCopy.cta}
                                    <ArrowRight className="transition-transform duration-300 ease-out-soft group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
                                </span>
                            </Link>
                        </Button>
                    )}
                </motion.div>
            </div>
        </motion.article>
    );
}

export function HomePlanSkeleton() {
    return (
        <div aria-hidden className="mx-auto w-full max-w-xl animate-pulse rounded-[2.25rem] bg-teal-900 p-10">
            <div className="h-6 w-28 rounded-full bg-white/10" />
            <div className="mt-10 h-20 w-52 rounded-2xl bg-white/10" />
            <div className="mt-8 space-y-4">
                {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="h-4 w-full rounded-full bg-white/10" />
                ))}
            </div>
            <div className="mt-10 h-14 w-full rounded-full bg-white/15" />
        </div>
    );
}

