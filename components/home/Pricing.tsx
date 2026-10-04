"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePlans } from "@/hooks/usePlans";
import { ROUTES } from "@/lib/config/routes";
import { REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Check, CircleAlert, Lock } from "lucide-react";
import Link from "next/link";
import { HomeSection } from "./HomeSection";
import { TiltCard } from "./Interactions";
import { HomePlanCard, HomePlanSkeleton } from "./PlanCard";
import { SectionHeader } from "./SectionHeader";
import { BODY_SM, DISPLAY_S, LABEL } from "./typography";

type GlassCardProps = {
    eyebrow: string;
    title: string;
    body: string;
    chips: readonly string[];
    action?: { href: string; label: string };
};

/** A white-glass card with a hairline: the supporting acts either side of the plan. */
function GlassCard({ eyebrow, title, body, chips, action }: GlassCardProps) {
    return (
        <motion.article
            variants={fadeUp(0, 24)}
            className="relative flex h-full flex-col rounded-[2rem] border border-white/80 bg-white/70 p-7 ring-1 ring-line backdrop-blur-sm sm:p-8"
        >
            <p className={cn(LABEL, "flex items-center gap-2.5 text-teal-700")}>
                <span aria-hidden className="size-1.5 rounded-full bg-gold" />
                {eyebrow}
            </p>
            <h3 className={cn(DISPLAY_S, "mt-5 text-ink")}>{title}</h3>
            <p className={cn(BODY_SM, "mt-3")}>{body}</p>
            <ul className="mt-6 space-y-2.5">
                {chips.map((chip) => (
                    <li key={chip} className="flex items-center gap-3 text-[0.9375rem] text-ink">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                            <Check className="size-3.5" strokeWidth={2.25} aria-hidden />
                        </span>
                        {chip}
                    </li>
                ))}
            </ul>
            {action ? (
                <Link
                    href={action.href}
                    className="group mt-auto inline-flex min-h-11 items-center gap-2 pt-7 text-[0.9375rem] font-semibold text-teal-700 transition-colors duration-200 hover:text-teal-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500"
                >
                    <span className="home-link-line">{action.label}</span>
                    <ArrowRight className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
                </Link>
            ) : null}
        </motion.article>
    );
}

/**
 * The same plan as /subscription — one card from the database, not a separate marketing table. It stands raised on an
 * ivory stage, deep teal with its thin gold edge, between the free start with Mira and what the plan leads to.
 */
export const Pricing = () => {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.pricing;
    const sub = dictionary.subscription;
    const mira = dictionary.header.agents.items.mira;
    const steps = dictionary.homeLanding.process.steps;
    const plans = usePlans();
    const plan = plans.plan;

    const reassurance = [
        { icon: Lock, text: copy.secure },
        { icon: Check, text: copy.trial },
        { icon: Check, text: copy.cancel },
    ];

    return (
        <HomeSection id="pricing" labelledBy="pricing-title" tone="tint">
            <SectionHeader variant="editorial" align="center" id="pricing-title" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} intro={copy.intro} />

            <motion.div
                variants={stagger(0.1)}
                initial="hidden"
                whileInView="show"
                viewport={REVEAL_VIEWPORT}
                className="relative mt-14 overflow-hidden rounded-[2.5rem] border border-line bg-[radial-gradient(70%_60%_at_50%_0%,#ffffff,#f8fbfa)] p-5 sm:p-8 md:mt-20 lg:p-12"
            >
                <span aria-hidden className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-teal-300 via-gold to-gold-100" />

                <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center lg:gap-8">
                    <div className="lg:h-[88%]">
                        <GlassCard eyebrow={mira.meta} title={steps[0][0]} body={steps[0][1]} chips={steps[0][2]} action={{ href: ROUTES.orientation, label: mira.cta }} />
                    </div>

                    {/* The recommended plan: raised, deep teal, a gold badge above it */}
                    <div className="relative order-first pt-5 lg:order-none lg:-translate-y-4">
                        <span className={cn(LABEL, "absolute start-1/2 top-0 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-gold bg-gold-100 px-3.5 py-1.5 text-gold-700 rtl:translate-x-1/2")}>
                            <span aria-hidden className="size-1.5 rounded-full bg-gold-600" />
                            {copy.popular}
                        </span>
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
                    </div>

                    <div className="lg:h-[88%]">
                        <GlassCard eyebrow={sub.included} title={steps[3][0]} body={steps[3][1]} chips={steps[3][2]} />
                    </div>
                </div>

                <motion.ul variants={fadeUp(0, 12)} className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[0.9375rem] text-ink-soft lg:mt-14">
                    {reassurance.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-center gap-2.5">
                            <span className="flex size-7 items-center justify-center rounded-full border border-teal-200 bg-white text-teal-700">
                                <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
                            </span>
                            {text}
                        </li>
                    ))}
                </motion.ul>
            </motion.div>
        </HomeSection>
    );
};
