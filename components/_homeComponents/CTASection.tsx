"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useScroll, useTransform } from "framer-motion";
import { Sparkles, Check, Play, ArrowRight } from "lucide-react";
import { ScrollReveal, TextReveal, MagneticButton } from "./AnimationUtilities";
import { useLanguage } from "@/contexts/LanguageContext";

export const CTASection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [120, -120]);
    const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1]);
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.cta;

    return (
        <section id="cta" ref={containerRef} className="py-32 md:py-40 bg-white relative overflow-hidden">
            {/* Animated ambient blobs */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.06, 0.03] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#518591] rounded-full blur-[140px] pointer-events-none"
            />
            <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.05, 0.03] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#e3b01c] rounded-full blur-[120px] pointer-events-none"
            />
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #2c3e3b 1px, transparent 0)", backgroundSize: "40px 40px" }} />

            <motion.div style={{ y, opacity, scale }} className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
                <ScrollReveal>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 mb-8">
                        <Sparkles size={16} className="text-[#e3b01c]" />
                        <span className="text-sm font-medium text-gray-500">{copy.eyebrow}</span>
                    </div>
                </ScrollReveal>

                <h2 className="font-display text-4xl md:text-5xl lg:text-7xl text-gray-900 tracking-tight mb-8">
                    <TextReveal>{copy.titleA}</TextReveal>
                    <br />
                    <TextReveal delay={0.15}>{copy.titleB}</TextReveal>
                </h2>

                <ScrollReveal delay={0.3}>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
                        {copy.body}
                    </p>
                </ScrollReveal>

                <ScrollReveal delay={0.5}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <MagneticButton className="px-12 py-5 rounded-full bg-gray-900 text-white font-bold text-lg shadow-2xl shadow-gray-900/20 hover:shadow-gray-900/40 hover:bg-black transition-all flex items-center gap-3 group magnetic-area">
                            {copy.primary}
                            <motion.span className="inline-block">
                                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                            </motion.span>
                        </MagneticButton>

                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.03)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-5 rounded-full border border-gray-200 text-gray-700 font-medium hover:border-gray-300 transition-all flex items-center gap-2"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#518591] to-[#e3b01c] flex items-center justify-center text-white shadow-md">
                                <Play size={16} fill="white" />
                            </div>
                            {copy.demo}
                        </motion.button>
                    </div>
                </ScrollReveal>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400"
                >
                    {copy.benefits.map((text, i) => {
                        const colors = ["text-[#518591]", "text-[#e3b01c]", "text-[#2c3e3b]"];
                        return { icon: <Check size={14} className={colors[i]} />, text };
                    }).map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 + i * 0.1 }}
                            className="flex items-center gap-2 bg-gray-50/80 px-4 py-2 rounded-full border border-gray-100"
                        >
                            {item.icon}
                            <span>{item.text}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};
