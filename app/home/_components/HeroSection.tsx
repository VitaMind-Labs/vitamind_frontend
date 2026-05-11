"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { GLSLHills } from "./GLSLHills";

export default function HeroSection() {
    const title = "The VitaMind";
    const subtitle = "Platform";

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.4 * i },
        }),
    };

    const childVariants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as const, damping: 12, stiffness: 100 },
        },
        hidden: { opacity: 0, y: 50 },
    };

    return (
        <section className="w-full">
            {/* Zone du Titre avec Background GLSL - Hauteur fixée et étudiée */}
            <div className="relative w-full h-[70vh] min-h-[450px] overflow-hidden rounded-3xl bg-transparent">
                {/* Background Shader */}
                <div className="absolute inset-0 z-0">
                    <GLSLHills />
                </div>

                {/* Contenu du titre */}
                <div className="relative z-20 flex h-full items-center px-6 md:px-16">
                    <motion.h1
                        className="text-[60px] leading-[0.9] tracking-tighter text-black md:text-[96px] lg:text-[120px]"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="flex flex-wrap">
                            {title.split(" ").map((word, idx) => (
                                <span key={idx} className="mr-4 flex overflow-hidden">
                                    {word.split("").map((letter, i) => (
                                        <motion.span key={i} variants={childVariants}>
                                            {letter}
                                        </motion.span>
                                    ))}
                                </span>
                            ))}
                        </div>

                        {/* Sous-titre avec dégradé clair pour visibilité sur shader */}
                        <motion.span
                            className="block bg-gradient-to-r from-black via-black/80 to-black/30 bg-clip-text text-transparent mt-2"
                            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
                            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
                            transition={{ duration: 1.5, delay: 0.8, ease: "circOut" }}
                        >
                            {subtitle}
                        </motion.span>
                    </motion.h1>
                </div>
            </div>

            {/* Section basse (Info & Scroll) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="mt-12 flex flex-col justify-between gap-8 border-t border-[var(--outline-variant)]/30 pt-8 md:flex-row md:items-center px-4"
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] animate-bounce">
                    <ArrowDown className="h-5 w-5 text-white" />
                </div>

                <p className="max-w-md text-[var(--on-surface-variant)] text-lg leading-relaxed font-medium">
                    Combining synthetic biology, chemistry, and AI into an engine of
                    discovery focused on biological intelligence.
                </p>
            </motion.div>
        </section>
    );
}