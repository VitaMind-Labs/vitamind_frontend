"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const phases = [
    {
        id: "01",
        title: "Mira AI Triage",
        description: "Empathic AI-powered conversation and adaptive symptom analysis before psychiatric orientation.",
        items: ["CBT / ACT conversational support", "Adaptive mental health triage", "Safe emotional onboarding"],
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: "02",
        title: "Clinical Questionnaires",
        description: "Validated psychological assessments used to detect emotional and cognitive risk patterns.",
        items: ["PHQ-9 & GAD-7", "ASRS & behavioral analysis", "Progressive emotional scoring"],
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: "03",
        title: "Digital Phenotyping",
        description: "Behavioral signal detection using typing dynamics and emotional interaction patterns.",
        items: ["Typing rhythm analysis", "Low-signal crisis detection", "AI emotional profiling"],
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: "04",
        title: "Wellbeing Dashboard",
        description: "Personalized interface for emotional stabilization and daily tracking.",
        items: ["Mood & energy tracking", "Guided grounding exercises", "Adaptive UI"],
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: "05",
        title: "Clinical Escalation",
        description: "Secure orientation toward mental health professionals with intelligent reporting.",
        items: ["Smart PDF export", "Psychiatric referral flow", "Crisis escalation protocol"],
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1600&auto=format&fit=crop",
    },
];

export default function DiscoverySection() {
    const [current, setCurrent] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    const next = useCallback(() => setCurrent((prev) => (prev + 1) % phases.length), []);
    const prev = useCallback(() => setCurrent((prev) => (prev - 1 + phases.length) % phases.length), []);

    useEffect(() => {
        if (isAutoPlaying) {
            autoPlayRef.current = setInterval(next, 5000);
        }

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
                autoPlayRef.current = null;
            }
        };
    }, [isAutoPlaying, next]);

    return (
        <section
            className="relative py-24 px-6 lg:px-20 bg-gradient-to-b from-white to-[#518591]/5"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <div className="max-w-7xl mx-auto">
                {/* En-tête */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#518591]/20 bg-white/80 px-4 py-2 backdrop-blur-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#e3b01c] animate-pulse" />
                        <span className="text-xs font-medium uppercase tracking-wider text-[#518591]">Discovery Workflow</span>
                    </div>
                    <h2 className="mt-6 text-4xl md:text-6xl font-bold tracking-tighter">
                        AI-powered mental
                        <br />
                        <span className="bg-gradient-to-r from-[#e3b01c] via-[#518591] to-[#e3b01c] bg-clip-text text-transparent">
                            healthcare journey
                        </span>
                    </h2>
                </div>

                {/* Carousel - Layout horizontal moderne */}
                <div className="relative">
                    {/* Conteneur principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Image */}
                        <div className="relative h-[300px] lg:h-[350px] w-full lg:w-[500px] rounded-2xl overflow-hidden shadow-2xl">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative h-full w-full"
                                >
                                    <Image src={phases[current].image} alt={phases[current].title} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                </motion.div>
                            </AnimatePresence>

                            {/* Badge */}
                            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                                <span className="text-xs font-bold text-[#518591]">Phase {phases[current].id}</span>
                            </div>
                        </div>

                        {/* Contenu */}
                        <div className="flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#518591] tracking-tight">
                                        {phases[current].title}
                                    </h3>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        {phases[current].description}
                                    </p>
                                    <ul className="space-y-3">
                                        {phases[current].items.map((item, idx) => (
                                            <motion.li
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="flex items-center gap-3"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#e3b01c]" />
                                                <span className="text-gray-700">{item}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Contrôles - plus compacts et élégants */}
                    <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-100">
                        {/* Navigation buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={prev}
                                className="p-2 rounded-full border border-gray-200 hover:border-[#518591] hover:bg-[#518591] hover:text-white transition-all duration-300 group"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-white" />
                            </button>
                            <button
                                onClick={next}
                                className="p-2 rounded-full border border-gray-200 hover:border-[#518591] hover:bg-[#518591] hover:text-white transition-all duration-300 group"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white" />
                            </button>
                        </div>

                        {/* Dots indicator */}
                        <div className="flex gap-2">
                            {phases.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrent(idx)}
                                    className={`transition-all duration-300 rounded-full ${idx === current
                                        ? "w-8 h-1.5 bg-gradient-to-r from-[#e3b01c] to-[#518591]"
                                        : "w-4 h-1.5 bg-gray-200 hover:bg-gray-300"
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Auto-play indicator */}
                        <div className="flex items-center gap-2">
                            <Sparkles className={`w-3 h-3 transition-colors ${isAutoPlaying ? "text-[#e3b01c]" : "text-gray-300"}`} />
                            <span className="text-xs text-gray-400 font-mono">
                                {phases[current].id}/{phases.length.toString().padStart(2, '0')}
                            </span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="absolute -bottom-8 left-0 right-0 h-0.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            key={current}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 5, ease: "linear" }}
                            className="h-full bg-gradient-to-r from-[#e3b01c] to-[#518591]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}