"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Users, Brain, MapPin, Sparkles, ArrowRight, Heart, Shield } from "lucide-react";

export default function FocusSection() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
        },
    };

    const focusItems = [
        {
            icon: Users,
            title: "Population focus",
            description:
                "Adults aged 18–45 who are experiencing persistent symptoms they cannot name, are on psychiatric waiting lists, or want to arrive at an appointment with structured, data-backed context.",
            color: "from-[hsl(45,93%,47%)] to-[hsl(45,93%,47%)]/60",
            stat: "18-45",
            statLabel: "Age range",
        },
        {
            icon: Brain,
            title: "Clinical conditions",
            description:
                "ADHD, bipolar, anxiety/PTSD, psychosis spectrum and depression are each supported by validated questionnaires, behavioral detection algorithms, and tailored therapeutic responses.",
            color: "from-[hsl(187,27%,40%)] to-[hsl(187,27%,40%)]/60",
            stat: "6+",
            statLabel: "Conditions supported",
        },
        {
            icon: MapPin,
            title: "Geographic markets",
            description:
                "Phase 1: Tunisia and France. Phase 2: Morocco, Algeria, Belgium and Switzerland — with a focus on Arabic and Francophone digital health infrastructure.",
            color: "from-[hsl(45,93%,47%)] to-[hsl(187,27%,40%)]",
            stat: "6",
            statLabel: "Countries",
        },
    ];

    return (
        <section ref={sectionRef} className="relative overflow-hidden py-20 px-4 md:py-28 md:px-8 lg:py-32">
            <div className="relative mx-auto max-w-7xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                >
                    <div className="inline-flex items-center gap-3 rounded-full border border-[hsl(187,27%,40%)]/20 bg-white/50 px-5 py-2.5 backdrop-blur-sm shadow-sm">
                        <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-2 w-2 rounded-full bg-[hsl(45,93%,47%)]"
                        />
                        <span className="font-mono text-xs font-medium uppercase tracking-[0.3em] text-[hsl(187,27%,40%)]">
                            Who We Serve
                        </span>
                    </div>

                    <h2 className="mt-8 text-3xl font-bold text-[hsl(187,27%,40%)] md:text-4xl lg:text-5xl">
                        Our Focus Areas
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-base text-[hsl(222,47%,11%)]/70 md:text-lg">
                        We're dedicated to providing accessible, culturally-aware mental health support
                    </p>
                </motion.div>

                {/* Main Content - Layout moderne sans cartes */}
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left Column - Hero Statement */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="sticky top-24 space-y-8">
                            {/* Badge décoratif */}
                            <div className="inline-flex items-center gap-2">
                                <Target className="h-5 w-5 text-[hsl(45,93%,47%)]" />
                                <span className="text-sm font-medium uppercase tracking-wider text-[hsl(187,27%,40%)]/60">
                                    Primary Mission
                                </span>
                            </div>

                            {/* Main Statement */}
                            <div className="relative">
                                <div className="absolute -left-4 top-0 h-32 w-1 bg-gradient-to-b from-[hsl(45,93%,47%)] to-[hsl(187,27%,40%)] rounded-full" />
                                <h3 className="pl-6 text-3xl font-bold leading-tight text-[hsl(187,27%,40%)] md:text-4xl lg:text-5xl">
                                    People who are struggling without a structured, culturally appropriate way to understand their distress.
                                </h3>
                            </div>

                            {/* Call to Action */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[hsl(187,27%,40%)] to-[hsl(45,93%,47%)] px-8 py-4 text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                            >
                                <span className="font-semibold">Learn more about our mission</span>
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </motion.button>

                            {/* Floating Stats */}
                            <div className="flex gap-6 pt-8">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(45,93%,47%)]/10">
                                        <Heart className="h-5 w-5 text-[hsl(45,93%,47%)]" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-[hsl(187,27%,40%)]">100K+</div>
                                        <div className="text-xs text-[hsl(187,27%,40%)]/60">Users supported</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(45,93%,47%)]/10">
                                        <Shield className="h-5 w-5 text-[hsl(45,93%,47%)]" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-[hsl(187,27%,40%)]">99.9%</div>
                                        <div className="text-xs text-[hsl(187,27%,40%)]/60">Data security</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Focus Items (style liste élégante) */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="space-y-8"
                    >
                        {focusItems.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.title}
                                    // variants={itemVariants}
                                    whileHover={{ x: 8 }}
                                    className="group relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-sm border border-[hsl(187,27%,40%)]/10 p-8 transition-all duration-500 hover:shadow-xl hover:border-[hsl(45,93%,47%)]/30"
                                >
                                    {/* Background gradient on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[hsl(187,27%,40%)]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                    <div className="relative">
                                        {/* Header avec icône animée */}
                                        <div className="mb-6 flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <motion.div
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(187,27%,40%)]/10 to-[hsl(45,93%,47%)]/10"
                                                >
                                                    <Icon className="h-7 w-7 text-[hsl(45,93%,47%)]" />
                                                </motion.div>
                                                <div>
                                                    <h4 className="text-2xl font-bold text-[hsl(187,27%,40%)]">
                                                        {item.title}
                                                    </h4>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <div className={`h-1.5 w-8 rounded-full bg-gradient-to-r ${item.color}`} />
                                                        <span className="text-xs font-medium text-[hsl(187,27%,40%)]/60">
                                                            {item.statLabel}: {item.stat}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Sparkles className="h-5 w-5 text-[hsl(45,93%,47%)]/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        </div>

                                        {/* Description */}
                                        <p className="text-base leading-relaxed text-[hsl(222,47%,11%)]/70 md:text-lg">
                                            {item.description}
                                        </p>

                                        {/* Indicateur visuel */}
                                        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[hsl(187,27%,40%)]/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                            <span>Explore {item.title.toLowerCase()}</span>
                                            <ArrowRight className="h-3 w-3" />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>

            </div>
        </section>
    );
}