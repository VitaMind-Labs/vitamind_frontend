"use client";

import { useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { type VariantProps } from "class-variance-authority";

import { buttonVariants } from "@/components/ui/button";
import { EASE_OUT, REVEAL_VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "left" | "right" | "scale";
};

/** Reveal once on scroll. Distances are deliberately small — calm, not theatrical. */
export const ScrollReveal = ({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) => {
    const variants = {
        up: { opacity: 0, y: 20 },
        left: { opacity: 0, x: -20 },
        right: { opacity: 0, x: 20 },
        scale: { opacity: 0, scale: 0.97 },
    };

    return (
        <motion.div
            initial={variants[direction]}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={REVEAL_VIEWPORT}
            transition={{ duration: 0.7, ease: EASE_OUT, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

/** Subtle pointer-follow wrapper for primary CTAs. Disabled for reduced motion and touch. */
export const Magnetic = ({ children, className, strength = 0.14 }: { children: ReactNode; className?: string; strength?: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const reduceMotion = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.2 });
    const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.2 });

    const handlePointerMove = (e: React.PointerEvent) => {
        if (reduceMotion || e.pointerType !== "mouse" || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * strength);
        y.set((e.clientY - rect.top - rect.height / 2) * strength);
    };

    return (
        <motion.div
            ref={ref}
            style={{ x: springX, y: springY }}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => { x.set(0); y.set(0); }}
            className={cn("inline-flex", className)}
        >
            {children}
        </motion.div>
    );
};

type MagneticButtonProps = ComponentPropsWithoutRef<typeof motion.button> & VariantProps<typeof buttonVariants> & {
    children: ReactNode;
    className?: string;
};

export const MagneticButton = ({ children, className, variant = "default", size = "default", ...props }: MagneticButtonProps) => (
    <Magnetic>
        <motion.button type="button" className={cn(buttonVariants({ variant, size }), className)} {...props}>
            {children}
        </motion.button>
    </Magnetic>
);

type TextRevealProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
};

/** Masked line reveal for headings. */
export const TextReveal = ({ children, className = "", delay = 0 }: TextRevealProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-40px" });

    return (
        <span ref={ref} className={cn("inline-block overflow-hidden pb-[0.12em] align-bottom", className)}>
            <motion.span
                className="inline-block"
                initial={{ y: "105%" }}
                animate={isInView ? { y: 0 } : { y: "105%" }}
                transition={{ duration: 0.9, ease: EASE_OUT, delay }}
            >
                {children}
            </motion.span>
        </span>
    );
};
