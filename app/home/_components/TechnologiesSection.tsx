"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const technologies = [
    {
        label: "Hosting & compliance",
        content:
            "HDS-certified hosting and full RGPD compliance for all health data, with data minimization, explicit consent flows, and a 72-hour deletion guarantee.",
    },
    {
        label: "Privacy-first architecture",
        content:
            "Journal entries are encrypted client-side so raw text never reaches the server. Only NLP flags and crisis trigger metadata are stored.",
    },
    {
        label: "Multilingual intelligence",
        content:
            "French, Arabic (including Darija) and English support from day one, with culturally aware agent flows and behavior detection adapted to each market.",
    },
];

export default function TechnologiesSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-20">
            <div className="border-t border-gray-200">
                {technologies.map((item, index) => {
                    const isOpen = activeIndex === index;

                    return (
                        <div key={item.label} className="border-b border-gray-200">
                            <span
                                onClick={() => setActiveIndex(isOpen ? null : index)}
                                className="w-full flex items-center justify-between py-10 text-left group"
                            >
                                <div className="flex items-center gap-8 md:gap-12">
                                    {/* Numérotation stylisée */}
                                    <span className="text-4xl md:text-5xl font-light text-gray-300">
                                        0{index + 1}.
                                    </span>
                                    {/* Titre */}
                                    <h3 className="text-4xl md:text-6xl font-medium tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-gray-600">
                                        {item.label}
                                    </h3>
                                </div>

                                {/* Icône Plus/Moins */}
                                <div className="text-gray-400">
                                    {isOpen ? <Minus size={32} strokeWidth={1} /> : <Plus size={32} strokeWidth={1} />}
                                </div>
                            </span>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        className="overflow-hidden"
                                    >
                                        {/* Conteneur du texte aligné à droite */}
                                        <div className="grid grid-cols-1 md:grid-cols-12 pb-16">
                                            <div className="hidden md:block md:col-span-7" />
                                            <div className="md:col-span-5">
                                                <motion.p
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.1, duration: 0.5 }}
                                                    className="text-xl md:text-2xl leading-relaxed text-gray-700 font-light"
                                                >
                                                    {item.content}
                                                </motion.p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}