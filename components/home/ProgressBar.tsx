"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useMotionValue } from "framer-motion";

export const ProgressBar = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    return (
        <motion.div
            aria-hidden
            className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-[linear-gradient(90deg,var(--color-teal-500),var(--color-gold))] rtl:origin-right"
            style={{ scaleX }}
        />
    );
};

export const CustomCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            const target = e.target as HTMLElement;
            setIsHovering(!!target.closest('button, a, [role="button"], .magnetic-area'));
        };
        window.addEventListener("mousemove", updateMousePosition);
        return () => window.removeEventListener("mousemove", updateMousePosition);
    }, [cursorX, cursorY]);

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
            style={{ x: cursorXSpring, y: cursorYSpring }}
            animate={{ scale: isHovering ? 2.5 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="relative -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
        </motion.div>
    );
};
