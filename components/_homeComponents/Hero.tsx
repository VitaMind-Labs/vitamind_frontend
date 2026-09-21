"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Brain, Check, Play, ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { MagneticButton, TextReveal, WordReveal } from "./AnimationUtilities";
import { GLSLHills } from "@/components/GLSLHills";

export const Hero = () => {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const textRef = useRef<HTMLDivElement | null>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "40% start"]
    });

    const textOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
    const textScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

    return (
        <section id="home" ref={sectionRef} className="relative bg-white overflow-hidden">

            {/* ===== ZONE HERO (GLSL en arrière-plan) ===== */}
            <div className="relative min-h-[85dvh] flex flex-col items-center justify-center px-6 lg:px-8 pt-24 pb-12 isolate">

                {/* GLSL Hills — uniquement derrière le texte */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                    className="absolute inset-0 -z-10"
                >
                    <GLSLHills />
                </motion.div>

                {/* Dégradé de fusion vers le blanc */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />

                {/* Contenu texte */}
                <motion.div
                    ref={textRef}
                    style={{ opacity: textOpacity, y: textY, scale: textScale }}
                    className="relative z-10 max-w-7xl w-full text-center"
                >
                    {/* Titre */}
                    <h1 className="font-display font-extralight text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] leading-[0.9] tracking-tighter mb-8 max-w-5xl mx-auto">
                        <TextReveal delay={0.4}>Your mind</TextReveal>
                        <br />
                        <TextReveal delay={0.5}>
                            <span className="text-gradient">deserves better</span>
                        </TextReveal>
                    </h1>

                    {/* Sous-titre */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <WordReveal
                            text="Experience the future of emotional intelligence. Our neural engine understands, adapts, and guides your mental wellness journey with unprecedented precision and care."
                            className="text-lg md:text-xl text-gray-600 leading-relaxed font-light"
                            delay={0.7}
                        />
                    </div>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                    >
                        <MagneticButton className="px-10 py-5 rounded-full bg-gray-900 text-white font-semibold text-lg shadow-2xl shadow-gray-900/20 hover:bg-black transition-all flex items-center gap-3 group magnetic-area">
                            Start Your Journey
                            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                        </MagneticButton>

                        <button className="flex items-center gap-3 px-8 py-5 rounded-full border border-gray-200/80 hover:border-gray-300 bg-white/60 backdrop-blur-sm transition-all group magnetic-area shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#518591] to-[#e3b01c] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                <Play size={18} fill="white" />
                            </div>
                            <span className="font-medium text-gray-700 text-lg">Watch Demo</span>
                        </button>
                    </motion.div>


                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
                >
                    <span className="text-[10px] text-gray-300 uppercase tracking-[0.3em] font-medium">Discover</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-5 h-8 rounded-full border border-gray-200 flex items-start justify-center p-1.5"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1 h-2 bg-gray-300 rounded-full"
                        />
                    </motion.div>
                </motion.div>
            </div>

            {/* ===== SÉPARATEUR ===== */}
            <div className="relative h-20 bg-white z-20 flex items-center justify-center">
                <div className="w-full max-w-3xl px-6 flex items-center gap-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="px-4 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm"
                    >
                        <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-medium">Live Preview</span>
                    </motion.div>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
                </div>
            </div>

            {/* ===== DASHBOARD (fond blanc, pas de GLSL) ===== */}
            <div className="relative bg-white z-10 pb-20 md:pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 80 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative max-w-5xl mx-auto px-6 lg:px-8"
                >
                    {/* Carte Dashboard */}
                    <div className="relative rounded-[20px] md:rounded-[32px] bg-white border border-gray-100 shadow-2xl shadow-gray-900/10 overflow-hidden">
                        {/* Chrome navigateur */}
                        <div className="flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-400" />
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400" />
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="flex-1 mx-4">
                                <div className="max-w-md mx-auto h-7 md:h-8 bg-white rounded-lg border border-gray-200 flex items-center px-3 gap-2">
                                    <Lock size={12} className="text-gray-400" />
                                    <span className="text-[10px] md:text-xs text-gray-400 truncate">app.vitamind.ai/dashboard</span>
                                </div>
                            </div>
                        </div>

                        {/* Contenu */}
                        <div className="p-4 md:p-8">
                            <div className="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-6">
                                {/* Sidebar — masquée sur mobile */}
                                <div className="hidden md:block md:col-span-3 space-y-3">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#518591] to-[#e3b01c] flex items-center justify-center">
                                            <Brain size={20} className="text-white" />
                                        </div>
                                        <span className="font-bold text-sm">VitaMind</span>
                                    </div>
                                    {["Dashboard", "Analytics", "Therapy", "Journal", "Settings"].map((item, i) => (
                                        <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${i === 0 ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                                            <div className="w-5 h-5 rounded-md bg-gray-200/50" />
                                            {item}
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile mini-header */}
                                <div className="md:hidden flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#518591] to-[#e3b01c] flex items-center justify-center">
                                        <Brain size={16} className="text-white" />
                                    </div>
                                    <span className="font-bold text-sm">VitaMind</span>
                                </div>

                                {/* Zone principale */}
                                <div className="col-span-12 md:col-span-9 space-y-4 md:space-y-6">
                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                                        {[
                                            { label: "Wellness Score", value: "92", change: "+4.2%", color: "#518591" },
                                            { label: "Streak", value: "14", change: "days", color: "#e3b01c" },
                                            { label: "Sessions", value: "28", change: "this month", color: "#2c3e3b" },
                                        ].map((stat, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.2 + i * 0.1 }}
                                                className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-gray-50/80 border border-gray-100"
                                            >
                                                <div className="text-[10px] md:text-xs text-gray-400 mb-1">{stat.label}</div>
                                                <div className="flex items-end gap-1 md:gap-2">
                                                    <span className="text-xl md:text-3xl font-bold text-gray-900">{stat.value}</span>
                                                    <span className="text-[10px] md:text-xs font-medium mb-0.5 md:mb-1" style={{ color: stat.color }}>{stat.change}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Graphique */}
                                    <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-gray-50/50 border border-gray-100">
                                        <div className="flex items-center justify-between mb-4 md:mb-6">
                                            <div>
                                                <div className="text-xs md:text-sm font-semibold text-gray-900">Emotional Baseline</div>
                                                <div className="text-[10px] md:text-xs text-gray-400">Last 30 days</div>
                                            </div>
                                            <div className="px-2 md:px-3 py-1 rounded-full bg-[#518591]/10 text-[#518591] text-[10px] md:text-xs font-medium">Stable</div>
                                        </div>
                                        <div className="h-24 md:h-32 flex items-end gap-1 md:gap-2">
                                            {[40, 55, 45, 70, 60, 80, 75, 85, 78, 92, 88, 95].map((h, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: 0 }}
                                                    whileInView={{ height: `${h}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                                                    className="flex-1 rounded-t-sm md:rounded-t-md bg-gradient-to-t from-[#518591]/20 to-[#e3b01c]/20"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Badges flottants — responsive */}
                    <motion.div
                        animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
                        transition={{ duration: 5, repeat: -1, ease: "easeInOut" }}
                        className="absolute -top-0 md:-top-0 right-2 md:-right-6 p-2.5 md:p-4 rounded-xl md:rounded-2xl bg-white border border-gray-100 shadow-xl z-20"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <Check size={14} className="text-green-600" />
                            </div>
                            <div>
                                <div className="text-[10px] md:text-xs font-bold text-gray-900">AI Insight</div>
                                <div className="text-[9px] md:text-[10px] text-gray-400">Pattern detected</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 12, 0], rotate: [0, -3, 0] }}
                        transition={{ duration: 6, repeat: -1, ease: "easeInOut", delay: 1 }}
                        className="absolute -bottom-2 md:-bottom-4 left-2 md:-left-4 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-[#518591] to-[#2c3e3b] shadow-xl text-white z-20"
                    >
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="md:size-4" />
                            <span className="text-[10px] md:text-xs font-bold">End-to-End Encrypted</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};