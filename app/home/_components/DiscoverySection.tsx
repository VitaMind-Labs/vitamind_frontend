"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    motion,
    AnimatePresence,
} from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";

const phases = [
    {
        id: "01",
        title: "Mira AI Triage",
        description:
            "Empathic AI-powered conversation and adaptive symptom analysis before psychiatric orientation.",
        items: [
            "CBT / ACT conversational support",
            "Adaptive mental health triage",
            "Safe emotional onboarding",
        ],
        image:
            "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: "02",
        title: "Clinical Questionnaires",
        description:
            "Validated psychological assessments used to detect emotional and cognitive risk patterns.",
        items: [
            "PHQ-9 & GAD-7",
            "ASRS & behavioral analysis",
            "Progressive emotional scoring",
        ],
        image:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: "03",
        title: "Digital Phenotyping",
        description:
            "Behavioral signal detection using typing dynamics and emotional interaction patterns.",
        items: [
            "Typing rhythm analysis",
            "Low-signal crisis detection",
            "AI emotional profiling",
        ],
        image:
            "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: "04",
        title: "Wellbeing Dashboard",
        description:
            "Personalized chromatherapy-inspired wellbeing interface for emotional stabilization.",
        items: [
            "Mood & energy tracking",
            "Guided grounding exercises",
            "Adaptive chromatherapy UI",
        ],
        image:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: "05",
        title: "Clinical Escalation",
        description:
            "Secure orientation toward mental health professionals with intelligent reporting.",
        items: [
            "Smart PDF export",
            "Psychiatric referral flow",
            "Crisis escalation protocol",
        ],
        image:
            "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1600&auto=format&fit=crop",
    },
];

export default function DiscoverySection() {
    const [current, setCurrent] = useState(0);

    const next = () => {
        setCurrent((prev) =>
            prev === phases.length - 1 ? 0 : prev + 1
        );
    };

    const prev = () => {
        setCurrent((prev) =>
            prev === 0 ? phases.length - 1 : prev - 1
        );
    };

    useEffect(() => {
        const timer = setInterval(() => {
            next();
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative min-h-screen bg-[var(--background)]">
            <div className="flex min-h-screen flex-col justify-center overflow-hidden px-6 lg:px-20">
                {/* HEADER */}
                <div className="mb-14 space-y-5">
                    <div className="inline-flex items-center gap-3 rounded-full border border-[var(--outline-variant)]/20 bg-[var(--surface-container-low)] px-4 py-2">
                        <div className="h-2 w-2 rounded-full bg-[var(--primary)]" />

                        <span className="font-mono-custom text-xs uppercase tracking-[0.3em] text-[var(--on-surface-variant)]">
                            VitaMind Workflow
                        </span>
                    </div>

                    <h2 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tighter text-[var(--primary)] md:text-7xl">
                        AI-powered mental
                        <br />
                        healthcare journey
                    </h2>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:items-center">
                    {/* IMAGE */}
                    <div className="relative md:col-span-5 lg:col-span-4">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[var(--outline-variant)]/10 bg-[var(--surface-container-low)] shadow-2xl">
                            <AnimatePresence mode="wait">
                                <StepImage
                                    key={current}
                                    phase={phases[current]}
                                />
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div className="relative min-h-[420px] md:col-span-7 md:pl-12 lg:col-span-6">
                        <AnimatePresence mode="wait">
                            <StepContent
                                key={current}
                                phase={phases[current]}
                            />
                        </AnimatePresence>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="mt-16 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                            <button
                                onClick={prev}
                                className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--outline-variant)]/20 transition hover:bg-black/5"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            <button
                                onClick={next}
                                className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--outline-variant)]/20 transition hover:bg-black/5"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="font-mono-custom text-xs uppercase tracking-[0.2em] text-[var(--on-surface-variant)]/40">
                            Phase {phases[current].id}
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-full bg-black/5">
                        <Progress
                            value={100}
                            className="h-[2px] bg-transparent"
                        />

                        <motion.div
                            key={current}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{
                                duration: 5,
                                ease: "linear",
                            }}
                            className="absolute left-0 top-0 h-full bg-[var(--primary)]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function StepImage({ phase }: any) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 1.08,
            }}
            animate={{
                opacity: 1,
                scale: 1,
            }}
            exit={{
                opacity: 0,
                scale: 0.96,
            }}
            transition={{
                duration: 0.8,
            }}
            className="absolute inset-0"
        >
            <Image
                src={phase.image}
                alt={phase.title}
                fill
                className="object-cover"
            />

            <div className="absolute inset-0 bg-black/10" />
        </motion.div>
    );
}

function StepContent({ phase }: any) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 30,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                y: -30,
            }}
            transition={{
                duration: 0.6,
            }}
            className="flex flex-col justify-center"
        >
            <div className="space-y-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-5">
                        <span className="font-mono-custom text-sm text-[var(--on-surface-variant)]/30">
                            {phase.id}
                        </span>

                        <div className="h-px flex-1 bg-[var(--outline-variant)]/30" />
                    </div>

                    <div className="space-y-5">
                        <h3 className="text-4xl font-semibold tracking-tight text-[var(--primary)] md:text-6xl">
                            {phase.title}
                        </h3>

                        <p className="max-w-xl text-lg leading-relaxed text-[var(--on-surface-variant)]">
                            {phase.description}
                        </p>
                    </div>
                </div>

                <ul className="space-y-5">
                    {phase.items.map((item: string) => (
                        <li
                            key={item}
                            className="group flex items-center gap-5"
                        >
                            <div className="h-2 w-2 rounded-full bg-[var(--primary)] transition-transform duration-300 group-hover:scale-150" />

                            <span className="text-base font-medium tracking-tight text-[var(--on-surface)]/80">
                                {item}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}