"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { BRAND } from "@/lib/config/brand";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Grain, WaveLines } from "./Atmosphere";
import { LABEL, SERIF } from "./typography";

type LoadingScreenProps = {
    onComplete: () => void;
};

const RING_R = 96;

/**
 * First visit only: the mark settles inside a ring that fills as the page prepares, and the whole
 * screen lifts away like a curtain. Counting is driven by a motion value — no per-frame re-render.
 */
export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
    const reduce = useReducedMotion();
    const progress = useMotionValue(0);
    const count = useTransform(progress, (value) => String(Math.round(value)).padStart(2, "0"));
    const ring = useTransform(progress, (value) => value / 100);
    const bar = useTransform(progress, (value) => value / 100);

    // The parent passes a fresh callback each render; keep the latest without restarting the count.
    const done = useRef(onComplete);
    useEffect(() => {
        done.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        const controls = animate(progress, 100, {
            duration: reduce ? 0.5 : 2.6,
            ease: EASE_IN_OUT,
            onComplete: () => {
                timer = setTimeout(() => done.current(), reduce ? 80 : 420);
            },
        });
        return () => {
            controls.stop();
            if (timer) clearTimeout(timer);
        };
    }, [progress, reduce]);

    return (
        <motion.div
            role="status"
            aria-label="Loading"
            initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={reduce ? { opacity: 0, transition: { duration: 0.3 } } : { clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 1, ease: EASE_IN_OUT } }}
            className="fixed inset-0 z-50 isolate overflow-hidden bg-[linear-gradient(160deg,var(--color-teal-900),var(--color-ink)_92%)] text-white"
        >
            <Grain />
            <WaveLines tone="deep" className="inset-y-0" />
            <div aria-hidden className="pointer-events-none absolute -top-40 end-[-10%] -z-10 size-[34rem] rounded-full bg-gold/20 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-52 start-[-12%] -z-10 size-[34rem] rounded-full bg-teal-500/25 blur-3xl" />

            <div className="relative flex h-full flex-col justify-between px-6 py-7 sm:px-10 sm:py-9">
                {/* Wordmark */}
                <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
                    className={cn(LABEL, "flex items-center gap-3 text-teal-100")}
                >
                    <span aria-hidden className="h-px w-8 bg-gold-300" />
                    {BRAND.name}
                </motion.p>

                {/* The mark inside its filling ring */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.1, ease: EASE_OUT }}
                        className="relative grid size-[min(16rem,62vw)] place-items-center"
                    >
                        <span aria-hidden className="absolute -inset-[28%] rounded-full bg-[radial-gradient(closest-side,rgb(227_176_28/0.28),rgb(81_133_145/0.22)_50%,transparent_75%)] blur-xl" />
                        <svg aria-hidden viewBox="0 0 200 200" className="absolute inset-0 size-full -rotate-90 rtl:rotate-90 rtl:-scale-x-100">
                            <circle cx="100" cy="100" r={RING_R} fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20" />
                            <motion.circle cx="100" cy="100" r={RING_R} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="text-gold-300" style={{ pathLength: ring }} />
                        </svg>
                        <motion.span
                            aria-hidden
                            className="absolute inset-[9%] rounded-full border border-dashed border-white/20"
                            animate={reduce ? undefined : { rotate: 360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        />
                        <Image src="/assets/vitamind-mark-3d.png" alt="" width={220} height={220} priority className="relative size-[46%] object-contain drop-shadow-[0_18px_28px_rgb(0_0_0/0.35)]" />
                    </motion.div>
                </div>

                {/* Counter and hairline */}
                <div className="flex items-end justify-between gap-6">
                    <p className={cn(SERIF, "flex items-start text-[clamp(4.5rem,13vw,10rem)] font-extralight leading-[0.8] tracking-[-0.05em] tabular-nums")} dir="ltr">
                        <motion.span>{count}</motion.span>
                        <span className="mt-[0.12em] ps-2 text-[0.2em] font-light tracking-normal text-gold-300">%</span>
                    </p>
                    <div aria-hidden className="mb-3 hidden h-px w-[min(28rem,40vw)] overflow-hidden bg-white/20 sm:block">
                        <motion.div style={{ scaleX: bar }} className="h-full origin-left bg-gold-300 rtl:origin-right" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
