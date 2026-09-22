"use client";

import { motion } from "framer-motion";
import { Star, Zap, Crown, Check, Lock, X, TrendingUp } from "lucide-react";
import { ScrollReveal, TextReveal, MagneticButton } from "./AnimationUtilities";
import { useLanguage } from "@/contexts/LanguageContext";

type Plan = {
    name: string;
    price: string;
    period: string;
    description: string;
    icon: React.ReactNode;
    features: readonly string[];
    cta: string;
    popular: boolean;
    accent: string;
};

export const Pricing = () => {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.pricing;

    const prices = ["€29", "€59", "€99"] as const;
    const plans: Plan[] = [
        {
            name: copy.plans[0][0],
            price: prices[0],
            period: copy.plans[0][1],
            description: copy.plans[0][2],
            icon: <Star size={24} />,
            features: copy.plans[0][3],
            cta: copy.plans[0][4],
            popular: false,
            accent: "#e3b01c"
        },
        {
            name: copy.plans[1][0],
            price: prices[1],
            period: copy.plans[1][1],
            description: copy.plans[1][2],
            icon: <Zap size={24} />,
            features: copy.plans[1][3],
            cta: copy.plans[1][4],
            popular: true,
            accent: "#518591"
        },
        {
            name: copy.plans[2][0],
            price: prices[2],
            period: copy.plans[2][1],
            description: copy.plans[2][2],
            icon: <Crown size={24} />,
            features: copy.plans[2][3],
            cta: copy.plans[2][4],
            popular: false,
            accent: "#2c3e3b"
        },
    ];

    return (
        <section id="pricing" className="py-32 md:py-40 bg-gray-50/30 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <ScrollReveal>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm mb-6">
                            <TrendingUp size={14} className="text-[#518591]" />
                            <span className="text-sm font-medium text-gray-500">{copy.eyebrow}</span>
                        </div>
                    </ScrollReveal>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 tracking-tight mb-10">
                        <TextReveal>{copy.titleA}</TextReveal>
                        <br />
                        <TextReveal delay={0.1}>{copy.titleB}</TextReveal>
                    </h2>
                    <ScrollReveal delay={0.2}>
                        <p className="text-gray-500 text-lg md:text-xl">{copy.intro}</p>
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.12, duration: 0.7 }}
                            className={`relative group ${plan.popular ? 'lg:-mt-3 lg:mb-3' : ''}`}
                        >
                            <div
                                className={`relative h-full rounded-[28px] p-8 md:p-10 transition-all duration-500 ${plan.popular
                                    ? 'bg-white border-2 border-[#518591]/20 shadow-xl shadow-gray-900/5'
                                    : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-900/3'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#518591] to-[#2c3e3b] text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                                        {copy.popular}
                                    </div>
                                )}

                                <div className="mb-8">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${plan.popular ? 'bg-[#518591]/5' : 'bg-gray-50'} transition-colors`} style={{ color: plan.popular ? '#518591' : plan.accent }}>
                                        {plan.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">{plan.description}</p>
                                </div>

                                <div className="mb-8 pb-8 border-b border-gray-100">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">{plan.price}</span>
                                        <span className="text-sm text-gray-400">{plan.period}</span>
                                    </div>
                                </div>

                                <ul className="space-y-3.5 mb-10">
                                    {plan.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-3">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.popular ? 'bg-[#518591]' : 'bg-gray-100'}`}>
                                                <Check size={11} className={plan.popular ? 'text-white' : 'text-gray-500'} />
                                            </div>
                                            <span className="text-sm text-gray-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <MagneticButton
                                    className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${plan.popular
                                        ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/10'
                                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-100'
                                        }`}
                                >
                                    {plan.cta}
                                </MagneticButton>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <ScrollReveal delay={0.4}>
                    <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
                        <div className="flex items-center gap-2"><Lock size={14} className="text-[#518591]" /> {copy.secure}</div>
                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                        <div className="flex items-center gap-2"><Check size={14} className="text-[#e3b01c]" /> {copy.trial}</div>
                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                        <div className="flex items-center gap-2"><X size={14} className="text-red-300" /> {copy.cancel}</div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};
