"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";

type LoadingScreenProps = {
    onComplete: () => void;
};

const DURATION_MS = 1800;

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const startTime = performance.now();
        let frame = 0;
        let doneTimer: ReturnType<typeof setTimeout> | undefined;

        const tick = (now: number) => {
            const next = Math.min(((now - startTime) / DURATION_MS) * 100, 100);
            setProgress(next);
            if (next < 100) frame = requestAnimationFrame(tick);
            else doneTimer = setTimeout(onComplete, 450);
        };
        frame = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frame);
            if (doneTimer) clearTimeout(doneTimer);
        };
    }, [onComplete]);

    return (
        <motion.div
            exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE_IN_OUT } }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(60%_50%_at_50%_45%,var(--color-teal-50),#ffffff_70%)] px-8"
            role="status"
            aria-label="Loading"
        >
            <div className="flex w-full max-w-xs flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, ease: EASE_OUT }}
                >
                    <BrandLogo size="xl" href={null} />
                </motion.div>

                <div className="mt-10 w-full">
                    <div className="h-[3px] overflow-hidden rounded-full bg-teal-100">
                        <div
                            className="h-full origin-left rounded-full bg-teal-500 rtl:origin-right"
                            style={{ transform: `scaleX(${progress / 100})` }}
                        />
                    </div>
                    <p className="mt-3 text-center font-mono text-xs tabular-nums text-ink-muted">{Math.round(progress)}%</p>
                </div>
            </div>
        </motion.div>
    );
};
