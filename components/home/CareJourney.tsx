"use client";

import { MIRA_MARK_SRC } from "@/components/layout/site-header/AgentAvatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { FileText, ShieldCheck, TrendingUp, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { DISPLAY_S, LABEL } from "./typography";

const LUMINA_MARK_SRC = "/assets/lumina-mark.png";
const MARKER = "size-14";

type NodeArt = { kind: "image"; src: string } | { kind: "icon"; icon: LucideIcon };
const ART: NodeArt[] = [
    { kind: "image", src: MIRA_MARK_SRC },
    { kind: "image", src: LUMINA_MARK_SRC },
    { kind: "icon", icon: TrendingUp },
    { kind: "icon", icon: FileText },
];

/** A small drawing per step, played once when the thread reaches it. Teal line work only. */
function Visual({ index, on }: { index: number; on: boolean }) {
    const reduce = useReducedMotion();
    const play = on || !!reduce;
    const draw = (delay: number) => ({
        initial: reduce ? false : { pathLength: 0 },
        animate: { pathLength: play ? 1 : 0 },
        transition: { duration: 1.1, delay, ease: EASE_OUT },
    });

    return (
        <svg viewBox="0 0 120 48" aria-hidden className="h-12 w-full overflow-visible">
            {index === 0 &&
                [
                    { d: "M 20 44 A 40 40 0 0 1 100 44", to: 0.92 },
                    { d: "M 32 44 A 28 28 0 0 1 88 44", to: 0.62 },
                    { d: "M 44 44 A 16 16 0 0 1 76 44", to: 0.78 },
                ].map((arc, i) => (
                    <g key={arc.d}>
                        <path d={arc.d} fill="none" className="stroke-teal-200" strokeWidth="2" strokeLinecap="round" />
                        <motion.path
                            d={arc.d}
                            fill="none"
                            className="stroke-teal-600"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            initial={reduce ? false : { pathLength: 0 }}
                            animate={{ pathLength: play ? arc.to : 0 }}
                            transition={{ duration: 1.1, delay: i * 0.15, ease: EASE_OUT }}
                        />
                    </g>
                ))}

            {index === 1 &&
                [26, 20, 14, 32, 22].map((height, i) => (
                    <motion.rect
                        key={i}
                        x={10 + i * 22}
                        y={44 - height}
                        width="12"
                        height={height}
                        rx="3"
                        className={i === 2 ? "fill-teal-300" : "fill-teal-600"}
                        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
                        initial={reduce ? false : { scaleY: 0 }}
                        animate={{ scaleY: play ? 1 : 0 }}
                        transition={{ duration: 0.8, delay: i * 0.08, ease: EASE_OUT }}
                    />
                ))}

            {index === 2 && (
                <>
                    <line x1="6" x2="114" y1="16" y2="16" className="stroke-teal-300" strokeWidth="1.5" strokeDasharray="3 4" />
                    <motion.path d="M6 12 C 26 12, 30 18, 48 18 S 76 27, 90 29 S 106 34, 114 35" fill="none" className="stroke-teal-600" strokeWidth="2.5" strokeLinecap="round" {...draw(0)} />
                    <motion.circle
                        cx="114"
                        cy="35"
                        r="3.5"
                        className="fill-teal-600"
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: play ? 1 : 0 }}
                        transition={{ delay: 1, duration: 0.4 }}
                    />
                </>
            )}

            {index === 3 &&
                [78, 100, 62].map((width, i) => (
                    <motion.rect
                        key={width}
                        x="10"
                        y={8 + i * 13}
                        width={width}
                        height="6"
                        rx="3"
                        className={i === 0 ? "fill-teal-600" : "fill-teal-200"}
                        style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
                        initial={reduce ? false : { scaleX: 0 }}
                        animate={{ scaleX: play ? 1 : 0 }}
                        transition={{ duration: 0.8, delay: i * 0.12, ease: EASE_OUT }}
                    />
                ))}
        </svg>
    );
}

function Marker({ art, lit, current }: { art: NodeArt; lit: boolean; current: boolean }) {
    return (
        <span
            className={cn(
                "relative flex items-center justify-center rounded-full border bg-white transition-[border-color,box-shadow] duration-700 ease-out-soft",
                MARKER,
                lit ? "border-teal-600 shadow-[0_0_0_5px_var(--color-teal-100)]" : "border-line-strong",
            )}
        >
            {art.kind === "image" ? (
                <Image src={art.src} alt="" width={64} height={64} className="size-[68%] object-contain" />
            ) : (
                <art.icon className={cn("size-6 transition-colors duration-700", lit ? "text-teal-700" : "text-ink-subtle")} strokeWidth={1.5} aria-hidden />
            )}
            {/* The single gold dot: where the thread has got to */}
            <AnimatePresence>
                {current ? (
                    <motion.span
                        key="dot"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.4, ease: EASE_OUT }}
                        className="absolute -end-0.5 -top-0.5 size-3.5 rounded-full border-2 border-white bg-gold"
                    />
                ) : null}
            </AnimatePresence>
        </span>
    );
}

/**
 * The hero's product stage: one care thread that draws itself as you scroll — teal at the start, gold at the end,
 * like the logo — lighting four steps in turn: Mira, Lumina, your evolution, the clinician report.
 * Nothing here pretends to be a screenshot; each step carries a small drawing of what it does.
 */
export function CareJourney(): ReactNode {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.journey;
    const reduce = useReducedMotion();
    const total = copy.nodes.length;

    const listRef = useRef<HTMLOListElement>(null);
    const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.8", "end 0.55"] });
    const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 });
    const [reached, setReached] = useState(0);

    useMotionValueEvent(scrollYProgress, "change", (value) => {
        const next = Math.min(total - 1, Math.max(0, Math.floor(value * total * 1.05)));
        setReached((current) => (current === next ? current : next));
    });

    const lastLit = reduce ? total - 1 : reached;

    return (
        <div className="relative overflow-hidden rounded-panel border border-line bg-white p-6 sm:p-9 lg:p-12">
            <span aria-hidden className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-teal-300 via-gold to-gold-100" />

            <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
                <p className={cn(LABEL, "flex items-center gap-3 text-teal-700")}>
                    <span aria-hidden className="h-px w-8 bg-gold" />
                    {copy.label}
                </p>
                <p className="flex items-center gap-2 text-[0.8125rem] text-ink-soft">
                    <ShieldCheck className="size-4 text-teal-600" aria-hidden />
                    {copy.note}
                </p>
            </div>

            <ol ref={listRef} className="relative mt-10 grid gap-8 lg:mt-12 lg:grid-cols-4 lg:gap-6">
                {/* The thread — horizontal on wide screens, vertical beside the steps on small ones */}
                <span aria-hidden className="absolute inset-x-[12.5%] top-7 hidden h-0.5 -translate-y-1/2 rounded-full bg-line-strong lg:block" />
                <motion.span
                    aria-hidden
                    style={{ scaleX: reduce ? 1 : progress }}
                    className="absolute inset-x-[12.5%] top-7 hidden h-0.5 origin-left -translate-y-1/2 rounded-full bg-gradient-to-r from-teal-600 via-teal-400 to-gold lg:block rtl:origin-right rtl:bg-gradient-to-l"
                />
                <span aria-hidden className="absolute bottom-7 start-7 top-7 w-0.5 -translate-x-1/2 rounded-full bg-line-strong lg:hidden rtl:translate-x-1/2" />
                <motion.span
                    aria-hidden
                    style={{ scaleY: reduce ? 1 : progress }}
                    className="absolute bottom-7 start-7 top-7 w-0.5 origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-teal-600 via-teal-400 to-gold lg:hidden rtl:translate-x-1/2"
                />

                {copy.nodes.map((node, index) => {
                    const lit = index <= lastLit;
                    return (
                        <motion.li
                            key={node.name}
                            initial={reduce ? false : { opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                            transition={{ duration: 0.8, delay: index * 0.08, ease: EASE_OUT }}
                            aria-current={index === lastLit ? "step" : undefined}
                            className="relative ps-[4.75rem] lg:ps-0 lg:pt-[5.25rem]"
                        >
                            <span className="absolute start-0 top-0 lg:start-1/2 lg:-translate-x-1/2 lg:rtl:translate-x-1/2">
                                <Marker art={ART[index]} lit={lit} current={index === lastLit} />
                            </span>

                            <div
                                className={cn(
                                    "group flex h-full flex-col rounded-2xl border bg-white p-5 transition-[border-color,transform,opacity] duration-700 ease-out-soft hover:-translate-y-1",
                                    lit ? "border-teal-200 opacity-100" : "border-line opacity-60",
                                )}
                            >
                                <div className="rounded-xl bg-teal-50 px-4 py-3">
                                    <Visual index={index} on={lit} />
                                </div>
                                <p className={cn(LABEL, "mt-5 text-gold-700")}>{node.kicker}</p>
                                <h3 className={cn(DISPLAY_S, "mt-2 text-ink")}>{node.name}</h3>
                                <p className="mt-2 text-[0.9375rem] leading-[1.7] text-ink-soft">{node.body}</p>
                                <ul className="mt-auto flex flex-wrap gap-2 pt-5">
                                    {node.chips.map((chip) => (
                                        <li key={chip} className="rounded-full border border-line bg-surface-muted px-3 py-1 text-[0.8125rem] font-medium text-ink-soft">
                                            {chip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.li>
                    );
                })}
            </ol>
        </div>
    );
}
