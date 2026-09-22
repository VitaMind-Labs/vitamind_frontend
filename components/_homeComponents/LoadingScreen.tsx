"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type LoadingScreenProps = {
    onComplete: () => void;
};

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
    const [progress, setProgress] = useState(0);
    const words = ["Initializing", "Calibrating", "Optimizing", "Ready"];
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const duration = 2000; // 2 seconds total
        const startTime = performance.now();
        
        const animateProgress = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);
            setProgress(newProgress);
            
            if (newProgress < 100) {
                requestAnimationFrame(animateProgress);
            } else {
                setTimeout(onComplete, 800);
            }
        };
        
        requestAnimationFrame(animateProgress);

        const wordTimer = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % words.length);
        }, 500);

        return () => { clearInterval(wordTimer); };
    }, [onComplete]);

    return (
        <motion.div
            exit={{ opacity: 0, y: -50, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans"
        >
            <div className="flex flex-col items-center max-w-lg w-full px-8">
                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-12 relative"
                >
                    <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#518591]/20 via-[#2c3e3b]/20 to-[#e3b01c]/20 rounded-full blur-2xl" />
                        <div className="relative rounded-full bg-white shadow-xl p-3">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={120}
                                height={120}
                                className="w-full h-full object-contain"
                                priority
                            />
                        </div>
                        <motion.div
                            className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#518591] via-[#2c3e3b] to-[#e3b01c] opacity-0"
                            animate={{ opacity: [0, 0.3, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                    
                    <motion.div
                        className="absolute -bottom-6 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#518591] to-transparent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                    />
                </motion.div>

                {/* Brand Name */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl md:text-6xl tracking-tighter font-light text-gray-900 mb-8"
                >
                    Vita<span className="text-[#518591] font-medium">Mind</span>
                </motion.h1>

                {/* Animated Word */}
                <div className="h-10 mb-10 overflow-hidden relative w-full text-center">
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={words[wordIndex]}
                            initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            exit={{ y: -30, opacity: 0, filter: "blur(8px)" }}
                            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                            className="block text-xs uppercase tracking-[0.3em] text-gray-500 font-medium"
                        >
                            {words[wordIndex]}
                        </motion.span>
                    </AnimatePresence>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-md space-y-3">
                    <div className="h-[2px] bg-gray-200 relative overflow-hidden rounded-full">
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#518591] via-[#2c3e3b] to-[#e3b01c] rounded-full"
                            style={{ width: `${progress}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>
                    <div className="flex justify-between items-center px-1">
                        <motion.div
                            animate={{ opacity: progress < 100 ? 1 : 0 }}
                            className="h-1 w-1 rounded-full bg-[#518591]"
                        />
                        <span className="text-gray-400 font-mono text-xs tracking-wider">
                            {Math.round(progress)}%
                        </span>
                        <motion.div
                            animate={{ opacity: progress < 100 ? 0.3 : 1 }}
                            className="text-[10px] uppercase tracking-wider text-[#518591] font-medium"
                        >
                            {progress === 100 ? "Complete" : "Loading"}
                        </motion.div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <motion.div
                    className="absolute bottom-8 left-8 w-20 h-20 border border-[#518591]/10 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute top-8 right-8 w-12 h-12 border border-[#e3b01c]/10 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
            </div>
        </motion.div>
    );
};