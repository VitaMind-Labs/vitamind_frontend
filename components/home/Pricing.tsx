"use client";

import { PlanOfferCard, PlanOfferSkeleton } from "@/components/pricing/PlanOfferCard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePlans } from "@/hooks/usePlans";
import { EASE_OUT, REVEAL_VIEWPORT, stagger } from "@/lib/motion";
import { motion } from "framer-motion";
import { Check, CircleAlert, Lock } from "lucide-react";
import { HomeSection } from "./HomeSection";
import { SectionHeader } from "./SectionHeader";

/** The same plan as /subscription — one card from the database, not a separate marketing table. */
export const Pricing = () => {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.pricing;
    const sub = dictionary.subscription;
    const plans = usePlans();
    const plan = plans.plan;

    return (
        <HomeSection id="pricing" labelledBy="pricing-title" tone="tint" spacing="top">
            <SectionHeader id="pricing-title" align="center" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} intro={copy.intro} />

            <motion.div variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} className="mt-12 md:mt-16">
                {plan ? (
                    <PlanOfferCard plan={plan} href="/subscription" />
                ) : plans.isLoading ? (
                    <PlanOfferSkeleton />
                ) : (
                    <div role="alert" className="mx-auto flex w-full max-w-xl flex-col items-center gap-3 rounded-[1.75rem] border border-rose-100 bg-rose-50 p-8 text-center">
                        <CircleAlert className="h-6 w-6 text-rose-700" aria-hidden />
                        <p className="font-semibold text-ink">{sub.plansUnavailableTitle}</p>
                        <p className="text-sm text-ink-soft">{sub.plansUnavailableBody}</p>
                        <Button variant="outline" onClick={() => void plans.refresh()}>
                            {sub.retry}
                        </Button>
                    </div>
                )}
            </motion.div>

            <motion.ul
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={REVEAL_VIEWPORT}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-muted"
            >
                <li className="flex items-center gap-2"><Lock className="h-4 w-4 text-teal-600" aria-hidden /> {copy.secure}</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-sage-700" aria-hidden /> {copy.trial}</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-sage-700" aria-hidden /> {copy.cancel}</li>
            </motion.ul>
        </HomeSection>
    );
};
