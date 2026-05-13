"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { GLSLHills } from "./GLSLHills";

export default function HeroSection() {
    const titleWords = ["VitaMind"];
    const subtitle = "Giving the soul a voice, and the mind its colors.";

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.2 },
        },
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
        <section className="relative w-full overflow-hidden ">
            {/* GLSL Hills Background */}
            <div className="relative w-full h-[75vh] min-h-[550px] overflow-hidden">
                {/* Gradient overlay for text readability */}
                {/* <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#2c3e3b]/40 via-transparent to-[#2c3e3b]/30" /> */}
                
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <GLSLHills />
                </div>

                {/* Content overlay */}
                <div className="relative z-20 flex h-full items-center px-6 md:px-16 lg:px-20">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-4xl"
                    >
                        {/* Main Title - Deep Teal color */}
                        <h1 className="text-[56px] font-bold leading-[1.1] tracking-tighter md:text-[84px] lg:text-[96px]">
                            <div className="flex flex-wrap">
                                {titleWords.map((word, idx) => {
                                    return (
                                        <span key={idx} className="mr-4 flex overflow-hidden">
                                            {word.split("").map((letter, i) => (
                                                <motion.span
                                                    key={i}
                                                    variants={childVariants}
                                                    className="text-[#518591] drop-shadow-sm"
                                                >
                                                    {letter}
                                                </motion.span>
                                            ))}
                                        </span>
                                    );
                                })}
                            </div>
                        </h1>

                        {/* Subtitle with brand colors */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="mt-6 max-w-2xl"
                        >
                            <div className="relative">
                                {/* Subtle background blur for contrast */}
                                <div className="absolute -inset-4 bg-[#518591]/10 blur-xl rounded-2xl" />
                                
                                <p className="relative text-xl font-medium leading-relaxed tracking-wide text-[#2c3e3b] md:text-2xl lg:text-3xl">
                                    <span className="bg-gradient-to-r from-[#518591] via-[#3d6a73] to-[#e3b01c] bg-clip-text text-transparent">
                                        {subtitle}
                                    </span>
                                </p>
                                
                                {/* Decorative line with brand colors */}
                                <div className="absolute -left-6 top-0 h-full w-0.5 bg-gradient-to-b from-[#e3b01c] via-[#518591] to-transparent" />
                            </div>
                        </motion.div>

                    </motion.div>
                </div>

                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F0F0F0] to-transparent z-20" />
            </div>

            {/* Bottom Info Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="relative z-20 mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-16"
            >
                <div className="flex flex-col items-start justify-between gap-8 border-t border-[#518591]/10 pt-8 md:flex-row md:items-center">
                    {/* Scroll Indicator */}
                    <div className="group flex cursor-pointer items-center gap-3 transition-all duration-300 hover:gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#518591] to-[#3d6a73] shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                            <ArrowDown className="h-4 w-4 text-white animate-bounce" />
                        </div>
                        <span className="text-xs font-medium uppercase tracking-wider text-[#518591]">
                            Scroll to explore
                        </span>
                    </div>

                    {/* Description */}
                    <div className="max-w-md">
                        <p className="text-base font-medium leading-relaxed text-[#2c3e3b]/70 md:text-lg">
                            Combining synthetic biology, chemistry, and AI into an engine of
                            discovery focused on biological intelligence.
                        </p>
                    </div>

                   
                </div>
            </motion.div>
        </section>
    );
}