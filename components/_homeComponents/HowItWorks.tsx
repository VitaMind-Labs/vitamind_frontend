"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useScroll, useTransform } from "framer-motion";
import { Fingerprint, Brain, HeartPulse, TrendingUp } from "lucide-react";
import { ScrollReveal, TextReveal } from "./AnimationUtilities";
import { useLanguage } from "@/contexts/LanguageContext";

type Step = {
    num: string;
    title: string;
    desc: string;
    icon: React.ReactNode;
    details: readonly string[];
};

export const HowItWorks = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });
    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.process;

    const steps: Step[] = [
        {
            num: "01",
            title: copy.steps[0][0],
            desc: copy.steps[0][1],
            icon: <Fingerprint size={28} />,
            details: copy.steps[0][2]
        },
        {
            num: "02",
            title: copy.steps[1][0],
            desc: copy.steps[1][1],
            icon: <Brain size={28} />,
            details: copy.steps[1][2]
        },
        {
            num: "03",
            title: copy.steps[2][0],
            desc: copy.steps[2][1],
            icon: <HeartPulse size={28} />,
            details: copy.steps[2][2]
        },
        {
            num: "04",
            title: copy.steps[3][0],
            desc: copy.steps[3][1],
            icon: <TrendingUp size={28} />,
            details: copy.steps[3][2]
        },
    ];

    return (
        <section id="how-it-works" ref={containerRef} className="py-32 md:py-40 bg-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #518591 1px, transparent 0)", backgroundSize: "48px 48px" }} />

            <div className="max-w-6xl mx-auto px-6 lg:px-8 relative">
                <div className="text-center mb-24">
                    <ScrollReveal>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 mb-6">
                            <div className="h-px w-6 bg-[#e3b01c]" />
                            <span className="text-sm font-medium text-gray-500">{copy.eyebrow}</span>
                        </div>
                    </ScrollReveal>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 tracking-tight mb-10">
                        <TextReveal>{copy.title}</TextReveal>
                    </h2>
                </div>

                <div className="relative">
                    {/* Animated Timeline Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-100 hidden lg:block -translate-x-1/2 overflow-hidden">
                        <motion.div style={{ height: lineHeight }} className="w-full bg-gradient-to-b from-[#518591] via-[#e3b01c] to-[#2c3e3b]" />
                    </div>

                    <div className="space-y-20 lg:space-y-32">
                        {steps.map((step, idx) => (
                            <div key={idx} className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                                <motion.div
                                    className="flex-1 w-full"
                                    initial={{ opacity: 0, x: idx % 2 === 0 ? -100 : 100, y: 50 }}
                                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <motion.div
                                        whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(44, 62, 59, 0.08)" }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="p-8 rounded-[28px] bg-white border border-gray-100 hover:border-gray-200 transition-all duration-500 group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#518591]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-4 mb-6">
                                                <motion.div
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#518591] to-[#e3b01c] flex items-center justify-center text-white shadow-lg shadow-[#518591]/20"
                                                >
                                                    {step.icon}
                                                </motion.div>
                                                <div>
                                                    <span className="text-xs font-bold text-[#e3b01c] uppercase tracking-wider block mb-1">Step {step.num}</span>
                                                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                                                </div>
                                            </div>
                                            <p className="text-gray-500 leading-relaxed mb-6">{step.desc}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {step.details.map((detail, dIdx) => (
                                                    <motion.span
                                                        key={dIdx}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        whileInView={{ opacity: 1, scale: 1 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: 0.3 + dIdx * 0.1 }}
                                                        className="px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600 hover:border-[#518591]/20 hover:text-[#518591] transition-colors cursor-default"
                                                    >
                                                        {detail}
                                                    </motion.span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>

                                {/* Timeline Node */}
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 15 }}
                                    className="relative z-10 hidden lg:flex items-center justify-center"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white border-4 border-[#e3b01c] shadow-lg shadow-[#e3b01c]/20 flex items-center justify-center">
                                        <div className="w-3 h-3 rounded-full bg-[#e3b01c]" />
                                    </div>
                                </motion.div>

                                <div className="flex-1 hidden lg:block" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
