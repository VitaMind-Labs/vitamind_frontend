"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Sparkles, Heart, Brain } from "lucide-react";

const cards = [
    {
        title: "How we design — zero-stigma UX",
        subtitle: "Clinical integrity, human warmth",
        icon: Heart,
        dark: true,
        description:
            "The interface feels like a supportive companion, not medical software: no diagnostic language until the user opts in, a single call-to-action, and adaptive chromatherapy that reduces stigma.",
        gradient: "from-[hsl(187,27%,40%)] to-[hsl(45,93%,47%)]",
    },
    {
        title: "How we detect — behavioral intelligence",
        subtitle: "Digital phenotyping",
        icon: Brain,
        dark: false,
        description:
            "We analyze typing, scrolling, mouse movement and NLP against each user&apos;s baseline to deliver precise triage without relying on population averages.",
        gradient: "from-[hsl(45,93%,47%)] to-[hsl(187,27%,40%)]",
    },
    {
        title: "How we protect — safety by design",
        subtitle: "Compliance first",
        icon: Shield,
        dark: false,
        description:
            "RGPD-compliant, encrypted journaling and audit-grade escalation ensure user safety while preserving privacy and clinical accountability.",
        gradient: "from-[hsl(187,27%,40%)] to-[hsl(45,93%,47%)]",
    },
];

export default function ApproachSection() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
        },
    };

    return (
        <section ref={sectionRef} className="relative overflow-hidden py-20 px-4 md:py-28 md:px-8 lg:py-32">
            {/* Background Gradients premium */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 -left-[20%] h-[80vh] w-[80vh] rounded-full bg-[hsl(187,27%,40%)]/5 blur-3xl" />
                <div className="absolute bottom-0 -right-[20%] h-[80vh] w-[80vh] rounded-full bg-[hsl(45,93%,47%)]/5 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[hsl(187,27%,40%)]/5 via-transparent to-[hsl(45,93%,47%)]/5 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl">
                {/* Section Header avec animations */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center lg:text-left"
                >
                    <div className="inline-flex items-center gap-3 rounded-full border border-[hsl(187,27%,40%)]/20 bg-white/50 px-5 py-2.5 backdrop-blur-sm shadow-sm">
                        <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-2 w-2 rounded-full bg-[hsl(45,93%,47%)]"
                        />
                        <span className="font-mono text-xs font-medium uppercase tracking-[0.3em] text-[hsl(187,27%,40%)]">
                            Our Approach
                        </span>
                    </div>
                </motion.div>

                {/* Header Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 gap-12 lg:grid-cols-2 mb-20"
                >
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold leading-tight text-[hsl(187,27%,40%)] md:text-5xl lg:text-6xl">
                            VitaMind is an AI-powered mental health triage and therapeutic support platform for French and Arabic speaking markets.
                        </h2>
                    </div>

                    <div className="flex items-end">
                        <div className="relative">
                            <div className="absolute -left-4 top-0 h-20 w-1 bg-gradient-to-b from-[hsl(45,93%,47%)] to-[hsl(187,27%,40%)] rounded-full" />
                            <p className="pl-6 text-base leading-relaxed text-[hsl(222,47%,11%)]/70 md:text-lg">
                                It does not replace licensed psychiatric care. Instead, it helps people identify symptoms, prepare for consultation, and live better between appointments.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Cards Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                >
                    {cards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.title}
                                // variants={itemVariants}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 ${card.dark
                                    ? "bg-gradient-to-br from-[hsl(187,27%,40%)] to-[hsl(45,93%,47%)] text-white shadow-2xl"
                                    : "bg-white/80 backdrop-blur-sm border border-[hsl(187,27%,40%)]/10 shadow-lg hover:shadow-2xl"
                                    }`}
                            >
                                {/* Glow effect on hover */}
                                <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${card.dark
                                    ? "bg-gradient-to-t from-white/10 to-transparent"
                                    : "bg-gradient-to-t from-[hsl(45,93%,47%)]/5 to-transparent"
                                    }`} />

                                {/* Content */}
                                <div className="relative p-8 flex flex-col h-full">
                                    {/* Icon avec animation */}
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className={`rounded-xl p-3 w-fit mb-6 ${card.dark
                                            ? "bg-white/20"
                                            : "bg-gradient-to-br from-[hsl(45,93%,47%)]/10 to-[hsl(187,27%,40%)]/10"
                                            }`}
                                    >
                                        <Icon className={`h-10 w-10 ${card.dark ? "text-white" : "text-[hsl(45,93%,47%)]"
                                            }`} />
                                    </motion.div>

                                    <div className="space-y-4 flex-1">
                                        <div>
                                            <span className={`font-mono text-[11px] font-medium uppercase tracking-[0.2em] ${card.dark ? "text-white/60" : "text-[hsl(187,27%,40%)]/60"
                                                }`}>
                                                {card.subtitle}
                                            </span>
                                            <h3 className={`mt-3 text-2xl font-bold leading-tight md:text-3xl ${card.dark ? "text-white" : "text-[hsl(187,27%,40%)]"
                                                }`}>
                                                {card.title}
                                            </h3>
                                        </div>

                                        <p className={`text-sm leading-relaxed md:text-base ${card.dark ? "text-white/80" : "text-[hsl(222,47%,11%)]/70"
                                            }`}>
                                            {card.description}
                                        </p>
                                    </div>

                                    {/* Décoration en bas */}
                                    <div className="mt-6 pt-4 border-t border-white/10">
                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider opacity-60">
                                            <Sparkles className="h-3 w-3" />
                                            <span>Learn more →</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bordure animée au hover */}
                                <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${card.gradient} transition-all duration-500 group-hover:w-full`} />
                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
}