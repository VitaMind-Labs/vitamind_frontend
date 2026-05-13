"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Shield, Heart } from "lucide-react";

export default function CTASection() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    const brands = [
        { name: "WHO", delay: 0 },
        { name: "APHP", delay: 0.1 },
        { name: "INSERM", delay: 0.2 },
        { name: "Tunisia MOH", delay: 0.3 },
    ];

    return (
        <section ref={sectionRef} className="relative overflow-hidden py-24 px-4 md:py-32 md:px-8">

            {/* Pattern décoratif */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 h-32 w-32 border border-[hsl(187,27%,40%)] rounded-full" />
                <div className="absolute bottom-20 right-20 h-48 w-48 border border-[hsl(45,93%,47%)] rounded-full" />
                <div className="absolute top-1/3 right-1/4 h-24 w-24 border border-[hsl(187,27%,40%)] rounded-full" />
            </div>

            <div className="relative mx-auto max-w-6xl">
                {/* Main Content avec animations */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center space-y-8"
                >
                    {/* Badge premium */}
                    <div className="inline-flex items-center gap-3 rounded-full border border-[hsl(187,27%,40%)]/20 bg-white/50 px-5 py-2.5 backdrop-blur-sm shadow-sm">
                        <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-2 w-2 rounded-full bg-[hsl(45,93%,47%)]"
                        />
                        <span className="font-mono text-xs font-medium uppercase tracking-[0.3em] text-[hsl(187,27%,40%)]">
                            Clinical Excellence
                        </span>
                    </div>

                    {/* Titre principal */}
                    <h2 className="max-w-4xl mx-auto text-3xl font-bold leading-tight text-[hsl(187,27%,40%)] md:text-4xl lg:text-5xl">
                        VitaMind does not diagnose, prescribe, or replace clinicians.
                    </h2>

                    {/* Description avec glow */}
                    <p className="max-w-2xl mx-auto text-base leading-relaxed text-[hsl(222,47%,11%)]/70 md:text-lg">
                        It prepares users for clinical encounters with structured, validated, shareable data,
                        while escalating acute risk and preserving consent and privacy.
                    </p>

                    {/* CTA Button avec animation premium */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col items-center justify-center gap-4 pt-4"
                    >
                        <div className="group flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative overflow-hidden rounded-full bg-gradient-to-r from-[hsl(187,27%,40%)] to-[hsl(45,93%,47%)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-xl transition-all duration-300 hover:shadow-2xl"
                            >
                                <span className="relative z-10">Start the experiment</span>
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-0" />
                            </motion.button>

                            <motion.div
                                whileHover={{ rotate: 90 }}
                                transition={{ duration: 0.3 }}
                                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[hsl(45,93%,47%)] to-[hsl(187,27%,40%)] shadow-lg transition-all duration-300 hover:shadow-xl"
                            >
                                <ArrowRight className="h-5 w-5 text-white" />
                            </motion.div>
                        </div>

                        {/* Petit texte informatif */}
                        <p className="text-xs text-[hsl(187,27%,40%)]/50 flex items-center gap-2">
                            <Shield className="h-3 w-3" />
                            Sécurisé & confidentiel
                            <Heart className="h-3 w-3 ml-2" />
                            Support 24/7
                        </p>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
}