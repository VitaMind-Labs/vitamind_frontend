"use client";

import {
    motion,
    useInView,
    useMotionTemplate,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Endless ticker. Always laid out LTR (its items carry their own direction); pauses off-screen
 * and when the reader prefers reduced motion it simply wraps as a static row.
 */
export function Marquee({ children, seconds = 40, className }: { children: ReactNode; seconds?: number; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const visible = useInView(ref, { margin: "10% 0px" });

    if (reduce) return <div className={cn("flex flex-wrap justify-center gap-3", className)}>{children}</div>;

    return (
        <div ref={ref} dir="ltr" className={cn("overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]", className)}>
            <motion.div className="flex w-max" animate={visible ? { x: ["0%", "-50%"] } : undefined} transition={{ duration: seconds, ease: "linear", repeat: Infinity }}>
                <div className="flex shrink-0 items-center gap-3 pe-3">{children}</div>
                <div className="flex shrink-0 items-center gap-3 pe-3" aria-hidden>
                    {children}
                </div>
            </motion.div>
        </div>
    );
}

/**
 * A surface that leans toward the pointer and carries a soft glare. Mouse only; flat for touch
 * and reduced motion so it never fights scrolling.
 */
export function TiltCard({ children, className, max = 5 }: { children: ReactNode; className?: string; max?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);
    const sx = useSpring(px, { stiffness: 120, damping: 20, mass: 0.4 });
    const sy = useSpring(py, { stiffness: 120, damping: 20, mass: 0.4 });
    const rotateY = useTransform(sx, [0, 1], [-max, max]);
    const rotateX = useTransform(sy, [0, 1], [max, -max]);
    const glareX = useTransform(sx, (v) => `${v * 100}%`);
    const glareY = useTransform(sy, (v) => `${v * 100}%`);
    const glare = useMotionTemplate`radial-gradient(28rem circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.22), transparent 60%)`;
    const glareOpacity = useMotionValue(0);

    const move = (event: React.PointerEvent) => {
        if (reduce || event.pointerType !== "mouse" || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        px.set((event.clientX - rect.left) / rect.width);
        py.set((event.clientY - rect.top) / rect.height);
        glareOpacity.set(1);
    };
    const leave = () => {
        px.set(0.5);
        py.set(0.5);
        glareOpacity.set(0);
    };

    return (
        <div style={{ perspective: "1400px" }} className={className}>
            <motion.div
                ref={ref}
                onPointerMove={move}
                onPointerLeave={leave}
                style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative will-change-transform"
            >
                {children}
                {reduce ? null : <motion.span aria-hidden style={{ background: glare, opacity: glareOpacity }} className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500" />}
            </motion.div>
        </div>
    );
}

/** Wraps a card with a pointer-following light inside its border. Pure CSS variables — no re-renders. */
export function Spotlight({ children, className, tone = "teal" }: { children: ReactNode; className?: string; tone?: "teal" | "gold" }) {
    const move = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    return (
        <div onPointerMove={move} className={cn("group/spot relative", className)}>
            <span
                aria-hidden
                className={cn(
                    "pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100",
                    tone === "gold"
                        ? "bg-[radial-gradient(22rem_circle_at_var(--mx,50%)_var(--my,50%),rgb(201_175_111/0.14),transparent_65%)]"
                        : "bg-[radial-gradient(22rem_circle_at_var(--mx,50%)_var(--my,50%),rgb(91_144_145/0.14),transparent_65%)]",
                )}
            />
            {children}
        </div>
    );
}
