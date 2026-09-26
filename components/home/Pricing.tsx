"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, REVEAL_VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { formatAed, PLANS, planCopyKey } from "@/lib/config/plans";
import { motion } from "framer-motion";
import { Check, Crown, Lock, Star, TrendingUp, Zap, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "./SectionHeader";

const ICONS: LucideIcon[] = [Star, Zap, Crown];
const POPULAR_INDEX = 1;

export const Pricing = () => {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.pricing;
    const subscriptionCopy = dictionary.subscription;

    return (
        <section id="pricing" className="section-y relative overflow-hidden bg-canvas">
            <div className="page-container">
                <SectionHeader
                    align="center"
                    eyebrow={copy.eyebrow}
                    icon={<TrendingUp className="h-3.5 w-3.5 text-teal-600" aria-hidden />}
                    titleA={copy.titleA}
                    titleB={copy.titleB}
                    intro={copy.intro}
                />

                <div className="mx-auto mt-14 grid max-w-xl items-stretch gap-5 md:mt-20 lg:max-w-6xl lg:grid-cols-3 lg:gap-6">
                    {PLANS.map((plan, idx) => {
                        const planCopy = dictionary.subscription[planCopyKey(plan.id)];
                        const popular = idx === POPULAR_INDEX;
                        const Icon = ICONS[idx];
                        return (
                            <motion.article
                                key={plan.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={REVEAL_VIEWPORT}
                                transition={{ delay: idx * 0.08, duration: 0.65, ease: EASE_OUT }}
                                className={cn(
                                    "surface-card surface-card-interactive relative flex min-w-0 flex-col p-7 md:p-8",
                                    popular && "border-teal-300 shadow-float ring-1 ring-teal-300 lg:-translate-y-3",
                                )}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <span className={cn("home-icon", popular && "border-teal-200 bg-teal-100 text-teal-800")}>
                                        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                                    </span>
                                    {popular && (
                                        <span className="rounded-full bg-ink px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white">
                                            {copy.popular}
                                        </span>
                                    )}
                                </div>

                                <h3 className="mt-5 text-xl font-semibold tracking-[-0.01em] text-ink">{planCopy.name}</h3>
                                <p className="mt-1.5 text-[0.9375rem] leading-6 text-ink-muted">{planCopy.desc}</p>

                                <p className="mt-6 flex items-baseline gap-1.5 border-y border-line py-5">
                                    <span className="text-4xl font-light tabular-nums tracking-[-0.03em] text-ink md:text-5xl" dir="ltr">{formatAed(plan.priceAed)}</span>
                                    <span className="text-sm text-ink-muted">AED {subscriptionCopy.perMonth}</span>
                                </p>

                                <ul className="mt-6 flex-1 space-y-3">
                                    {planCopy.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full", popular ? "bg-primary text-white" : "bg-sage-100 text-sage-700")}>
                                                <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                                            </span>
                                            <span className="min-w-0 text-[0.9375rem] leading-6 text-ink-soft">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button asChild variant={popular ? "default" : "outline"} size="lg" className="mt-8 w-full">
                                    <Link href={`/subscription?plan=${plan.id}`}>{planCopy.cta}</Link>
                                </Button>
                            </motion.article>
                        );
                    })}
                </div>

                <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-ink-muted">
                    <li className="flex items-center gap-2"><Lock className="h-4 w-4 text-teal-600" aria-hidden /> {copy.secure}</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-sage-700" aria-hidden /> {copy.trial}</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-sage-700" aria-hidden /> {copy.cancel}</li>
                </ul>
            </div>
        </section>
    );
};
