"use client";

import { useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { motion, useSpring, useMotionValue, useInView } from "framer-motion";

type ScrollRevealProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "left" | "right" | "scale";
};

export const ScrollReveal = ({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    const variants = {
        up: { initial: { opacity: 0, y: 80 }, animate: { opacity: 1, y: 0 } },
        left: { initial: { opacity: 0, x: -80 }, animate: { opacity: 1, x: 0 } },
        right: { initial: { opacity: 0, x: 80 }, animate: { opacity: 1, x: 0 } },
        scale: { initial: { opacity: 0, scale: 0.85 }, animate: { opacity: 1, scale: 1 } },
    };

    return (
        <motion.div
            ref={ref}
            initial={variants[direction].initial}
            animate={isInView ? variants[direction].animate : variants[direction].initial}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

type MagneticButtonProps = ComponentPropsWithoutRef<typeof motion.button> & {
    children: ReactNode;
    className?: string;
};

export const MagneticButton = ({ children, className, ...props }: MagneticButtonProps) => {
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
    };

    return (
        <motion.button
            ref={ref}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            className={className}
            {...props}
        >
            {children}
        </motion.button>
    );
};

type TextRevealProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
};

export const TextReveal = ({ children, className = "", delay = 0 }: TextRevealProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
            <motion.span
                className="inline-block"
                initial={{ y: "120%", rotate: 3 }}
                animate={isInView ? { y: 0, rotate: 0 } : { y: "120%", rotate: 3 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
            >
                {children}
            </motion.span>
        </span>
    );
};

type WordRevealProps = {
    text: string;
    className?: string;
    delay?: number;
};

export const WordReveal = ({ text, className = "", delay = 0 }: WordRevealProps) => {
    const ref = useRef<HTMLParagraphElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-40px" });
    const words = text.split(" ");

    return (
        <p ref={ref} className={className}>
            {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
                    <motion.span
                        className="inline-block"
                        initial={{ y: "100%", opacity: 0 }}
                        animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.03 }}
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </p>
    );
};
