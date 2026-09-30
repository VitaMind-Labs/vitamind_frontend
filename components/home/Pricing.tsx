"use client";

import { Button } from "@/components/ui/button";
import { FEATURED_PLAN_ID, PLAN_GRID_CLASS, PlanColumnBody, PlanEmphasisBar, PlanTag, planColumnClass } from "@/components/pricing/PlanColumn";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { PLANS, planCopyKey } from "@/lib/config/plans";
import { motion } from "framer-motion";
import { ArrowRight, Check, Lock } from "lucide-react";
import Link from "next/link";
import { HomeSection } from "./HomeSection";
import { SectionHeader } from "./SectionHeader";

export const Pricing = () => {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.pricing;

    return (
        <HomeSection id="pricing" labelledBy="pricing-title" tone="tint" spacing="top">
            <SectionHeader id="pricing-title" align="center" eyebrow={copy.eyebrow} titleA={copy.titleA} titleB={copy.titleB} intro={copy.intro} />

            {/* One comparison surface, divided by hairlines — not three floating cards. */}
            <motion.ul
                variants={stagger(0.08)}
                initial="hidden"
                whileInView="show"
                viewport={REVEAL_VIEWPORT}
                className={`${PLAN_GRID_CLASS} mt-12 md:mt-16`}
            >
                {PLANS.map((plan) => {
                    const featured = plan.id === FEATURED_PLAN_ID;
                    return (
                        <motion.li key={plan.id} variants={fadeUp(0, 16)} aria-labelledby={`plan-${plan.id}`} className={planColumnClass(featured)}>
                            {featured && <PlanEmphasisBar />}
                            <PlanColumnBody
                                plan={plan}
                                emphasis={featured}
                                headingId={`plan-${plan.id}`}
                                tags={featured ? <PlanTag tone="featured">{copy.popular}</PlanTag> : null}
                                action={
                                    <Button asChild variant={featured ? "default" : "outline"} size="lg" className="group w-full">
                                        <Link href={`/subscription?plan=${plan.id}`}>
                                            {dictionary.subscription[planCopyKey(plan.id)].cta}
                                            <ArrowRight
                                                className="transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                                                aria-hidden
                                            />
                                        </Link>
                                    </Button>
                                }
                            />
                        </motion.li>
                    );
                })}
            </motion.ul>

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
