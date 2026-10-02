"use client";

import Image from "next/image";
import Link from "next/link";
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
    type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { AgentAvatar } from "@/components/layout/site-header/AgentAvatar";
import { AGENTS } from "@/components/layout/site-header/agents";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { DISPLAY_S, LABEL } from "./typography";

/** Dots riding the orbits: [ring index, start angle, colour]. Purely decorative. */
const ORBIT_DOTS = [
    { ring: 0, angle: 20, className: "bg-gold" },
    { ring: 1, angle: 200, className: "bg-sage" },
    { ring: 2, angle: 110, className: "bg-teal-400" },
] as const;

const RING_STYLE = [
    "border-teal-300/70",
    "border-dashed border-gold-300/80",
    "border-sage/50",
] as const;

/** One layer of the orb, nudged against the pointer at its own depth. */
function Depth({ x, y, depth, className, children }: { x: MotionValue<number>; y: MotionValue<number>; depth: number; className?: string; children?: ReactNode }) {
    const tx = useTransform(x, [-0.5, 0.5], [-depth, depth]);
    const ty = useTransform(y, [-0.5, 0.5], [-depth, depth]);
    return (
        <motion.div style={{ x: tx, y: ty }} className={className}>
            {children}
        </motion.div>
    );
}

/** Soft halo, three slow hairline orbits and the VitaMind mark — one focal object with real depth. */
function Orb({ x, y }: { x: MotionValue<number>; y: MotionValue<number> }) {
    const reduce = useReducedMotion();

    return (
        <div className="relative mx-auto grid aspect-square w-[min(20rem,76vw)] place-items-center lg:w-[min(26rem,100%)]" aria-hidden>
            {/* Halo — breathes slowly */}
            <Depth x={x} y={y} depth={-14} className="absolute -inset-[22%]">
                <motion.span
                    className="block size-full rounded-full bg-[radial-gradient(closest-side,rgb(227_176_28/0.2),rgb(81_133_145/0.2)_46%,transparent_74%)] blur-2xl"
                    animate={reduce ? undefined : { scale: [0.94, 1.06, 0.94], opacity: [0.85, 1, 0.85] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                />
            </Depth>

            {/* Orbits */}
            <Depth x={x} y={y} depth={8} className="absolute inset-0">
                {[100, 78, 56].map((size, ring) => (
                    <span
                        key={size}
                        className={cn("absolute start-1/2 top-1/2 rounded-full border motion-safe:animate-spin motion-reduce:animate-none", RING_STYLE[ring])}
                        style={{
                            width: `${size}%`,
                            height: `${size}%`,
                            marginInlineStart: `${-size / 2}%`,
                            marginTop: `${-size / 2}%`,
                            animationDuration: `${64 - ring * 14}s`,
                            animationDirection: ring === 1 ? "reverse" : "normal",
                        }}
                    >
                        {ORBIT_DOTS.filter((dot) => dot.ring === ring).map((dot) => (
                            <span
                                key={dot.angle}
                                className={cn("absolute size-2.5 rounded-full shadow-[0_0_0_5px_rgb(255_255_255/0.75)]", dot.className)}
                                style={{ left: `${50 + 50 * Math.cos((dot.angle * Math.PI) / 180)}%`, top: `${50 + 50 * Math.sin((dot.angle * Math.PI) / 180)}%`, transform: "translate(-50%,-50%)" }}
                            />
                        ))}
                    </span>
                ))}
            </Depth>

            {/* Ground shadow */}
            <span className="absolute bottom-[8%] h-5 w-[34%] rounded-full bg-teal-900/20 blur-xl" />

            <Depth x={x} y={y} depth={22} className="relative size-[40%]">
                <Image src="/assets/vitamind-mark-3d.png" alt="" width={260} height={260} priority className="size-full object-contain drop-shadow-[0_22px_28px_rgb(34_60_65/0.3)]" />
            </Depth>
        </div>
    );
}

function AgentTile({ id, index, className }: { id: (typeof AGENTS)[number]["id"]; index: number; className?: string }) {
    const { dictionary } = useLanguage();
    const reduce = useReducedMotion();
    const agent = AGENTS.find((item) => item.id === id)!;
    const copy = dictionary.header.agents.items[id];
    const live = agent.status === "live";

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, delay: 0.15 + index * 0.15, ease: EASE_OUT }}
            className={cn("relative", className)}
        >
            <motion.div className="h-full" animate={reduce ? undefined : { y: [0, -4, 0] }} transition={{ duration: 8 + index * 2, repeat: Infinity, ease: "easeInOut" }}>
                <Link
                    href={agent.href}
                    className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-panel border border-line bg-white/80 p-6 text-start shadow-[var(--shadow-soft)] backdrop-blur-md transition-[transform,box-shadow,border-color] duration-500 ease-out-soft hover:-translate-y-1 hover:border-teal-200 hover:shadow-[var(--shadow-soft-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 sm:p-7"
                >
                    <span aria-hidden className={cn("absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent to-transparent", live ? "via-teal-500" : "via-gold")} />
                    <div className="flex items-center gap-4">
                        <AgentAvatar agent={id} className={cn("size-14 ring-1 ring-line", agent.tone.ring)} />
                        <div className="min-w-0 flex-1">
                            <p className={cn(DISPLAY_S, "text-ink")}>{copy.name}</p>
                            <p className="mt-1 text-[0.9375rem] text-ink-soft">{copy.role}</p>
                        </div>
                        <ArrowUpRight className="size-5 shrink-0 text-ink-muted transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:text-teal-700 rtl:-scale-x-100 rtl:group-hover:translate-x-0.5" aria-hidden />
                    </div>

                    <p className="line-clamp-4 text-[0.9375rem] leading-7 text-ink-soft">{copy.description}</p>

                    <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-4">
                        <span className={cn(LABEL, "inline-flex items-center gap-2 rounded-full px-3 py-1.5", agent.tone.tint, agent.tone.text)}>
                            <span className="relative flex size-1.5">
                                {live && <span className={cn("absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping", agent.tone.dot)} />}
                                <span className={cn("relative inline-flex size-1.5 rounded-full", agent.tone.dot)} />
                            </span>
                            {copy.status}
                        </span>
                        <span className="text-[0.8125rem] text-ink-soft">{copy.meta}</span>
                    </div>
                </Link>
            </motion.div>
        </motion.div>
    );
}

/**
 * The hero's showcase: the two agents either side of VitaMind's mark, joined by a thread of light.
 * It says what the product is — one continuous care journey — without pretending to be a screenshot.
 */
export function CareOrbit() {
    const reduce = useReducedMotion();
    const stageRef = useRef<HTMLDivElement>(null);
    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const x = useSpring(px, { stiffness: 50, damping: 18, mass: 0.7 });
    const y = useSpring(py, { stiffness: 50, damping: 18, mass: 0.7 });

    // The orb rises slower than the page — a little distance between it and the cards.
    const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "end start"] });
    const orbY = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 36, reduce ? 0 : -36]);

    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (reduce || event.pointerType !== "mouse" || !stageRef.current) return;
        const rect = stageRef.current.getBoundingClientRect();
        px.set((event.clientX - rect.left) / rect.width - 0.5);
        py.set((event.clientY - rect.top) / rect.height - 0.5);
    };
    const onPointerLeave = () => {
        px.set(0);
        py.set(0);
    };

    return (
        <div
            ref={stageRef}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            className="relative overflow-hidden rounded-panel border border-line bg-[linear-gradient(165deg,rgb(255_255_255/0.85),rgb(241_246_246/0.7))] p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-8 lg:p-12"
        >
            <div className="relative grid items-center gap-5 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,26rem)_minmax(0,1fr)] lg:gap-10">
                {/* The thread of light joining both agents through the orb (desktop). */}
                <span aria-hidden className="absolute inset-x-[8%] top-1/2 hidden h-px bg-gradient-to-r from-transparent via-teal-300 to-gold/60 lg:block" />

                <motion.div style={{ y: orbY }} className="relative md:col-span-2 lg:order-none lg:col-span-1 lg:col-start-2 lg:row-start-1">
                    <Orb x={x} y={y} />
                </motion.div>

                <AgentTile id="mira" index={0} className="lg:col-start-1 lg:row-start-1" />
                <AgentTile id="lumina" index={1} className="lg:col-start-3 lg:row-start-1" />
            </div>
        </div>
    );
}
