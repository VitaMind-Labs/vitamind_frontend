"use client";

import { MIRA_MARK_SRC } from "@/components/layout/site-header/AgentAvatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { FileText, ShieldCheck, TrendingUp, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { pad } from "./accents";
import { DISPLAY_M, LABEL, SERIF } from "./typography";

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
 * The hero's product stage: one care thread running down the middle of the page, with the four steps hung off it
 * on alternating sides — Mira, Lumina, your evolution, the clinician report. The thread fills teal to gold as you
 * scroll, each marker lights in turn, and an oversized numeral answers every step from the opposite side.
 * Nothing here pretends to be a screenshot; each step carries a small drawing of what it does.
 */
export function CareJourney({ children }: { children?: ReactNode }): ReactNode {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.journey;
    const reduce = useReducedMotion();
    const total = copy.nodes.length;

    const listRef = useRef<HTMLOListElement>(null);
    const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.75", "end 0.6"] });
    const [reached, setReached] = useState(0);

    useMotionValueEvent(scrollYProgress, "change", (value) => {
        const next = Math.min(total - 1, Math.max(0, Math.floor(value * total * 1.05)));
        setReached((current) => (current === next ? current : next));
    });

    const lastLit = reduce ? total - 1 : reached;

    return (
        <div>
            {/* Introduction: centred over the thread, where it starts */}
            <motion.div
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.9, ease: EASE_OUT }}
                className="mx-auto max-w-2xl text-center"
            >
                <p className={cn(LABEL, "flex items-center justify-center gap-3 text-teal-700")}>
                    <span aria-hidden className="h-px w-8 bg-gold" />
                    {copy.label}
                    <span aria-hidden className="h-px w-8 bg-gold" />
                </p>
                <p className="mt-5 flex items-start justify-center gap-2.5 text-start text-[0.9375rem] leading-7 text-ink-soft">
                    <ShieldCheck className="mt-1 size-4 shrink-0 text-teal-600" aria-hidden />
                    <span className="min-w-0">{copy.note}</span>
                </p>
                {children ? <div className="mx-auto mt-7 max-w-xl text-start">{children}</div> : null}
                <span aria-hidden className="mx-auto mt-10 block h-12 w-0.5 rounded-full bg-gradient-to-b from-transparent to-teal-600" />
            </motion.div>

            <ol ref={listRef} className="mt-0">
                {copy.nodes.map((node, index) => {
                    const lit = index <= lastLit;
                    const last = index === total - 1;
                    const far = index % 2 === 1; // lands on the end side on wide screens
                    return (
                        <motion.li
                            key={node.name}
                            initial={reduce ? false : { opacity: 0, y: 36 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                            transition={{ duration: 0.9, ease: EASE_OUT }}
                            aria-current={index === lastLit ? "step" : undefined}
                            className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 sm:gap-x-7 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-x-14"
                        >
                            {/* The spine: marker, then the thread down to the next step */}
                            <div className="col-start-1 row-start-1 flex flex-col items-center lg:col-start-2">
                                <Marker art={ART[index]} lit={lit} current={index === lastLit} />
                                {!last ? (
                                    <span aria-hidden className="relative mt-3 w-0.5 flex-1 rounded-full bg-line-strong">
                                        <span
                                            className={cn(
                                                "absolute inset-0 origin-top rounded-full bg-gradient-to-b from-teal-600 to-gold transition-transform duration-1000 ease-out-soft",
                                                index < lastLit ? "scale-y-100" : "scale-y-0",
                                            )}
                                        />
                                    </span>
                                ) : null}
                            </div>

                            {/* The step */}
                            <div
                                className={cn(
                                    "col-start-2 row-start-1 min-w-0 transition-opacity duration-700 ease-out-soft",
                                    last ? "pb-0" : "pb-14 lg:pb-20",
                                    far ? "lg:col-start-3" : "lg:col-start-1 lg:text-end",
                                    lit ? "opacity-100" : "opacity-55",
                                )}
                            >
                                <div className={cn("rounded-2xl bg-teal-50 px-5 py-4 sm:max-w-[16rem]", !far && "lg:ms-auto")} aria-hidden>
                                    <Visual index={index} on={lit} />
                                </div>
                                <p className={cn(LABEL, "mt-6 flex items-center gap-3 text-gold-700", !far && "lg:flex-row-reverse")}>
                                    <span className="tabular-nums" dir="ltr">
                                        {pad(index + 1)}
                                    </span>
                                    <span aria-hidden className="h-px w-6 bg-gold" />
                                    {node.kicker}
                                </p>
                                <h3 className={cn(DISPLAY_M, "mt-3 text-ink")}>{node.name}</h3>
                                <p className={cn("mt-3 max-w-xl text-[1rem] leading-[1.75] text-ink-soft", !far && "lg:ms-auto")}>{node.body}</p>
                                <ul className={cn("mt-5 flex flex-wrap gap-2", !far && "lg:justify-end")}>
                                    {node.chips.map((chip) => (
                                        <li key={chip} className="rounded-full border border-line bg-white px-3 py-1 text-[0.8125rem] font-medium text-ink-soft">
                                            {chip}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* The numeral on the opposite side: a large, quiet answer to the step */}
                            <span
                                aria-hidden
                                className={cn(
                                    SERIF,
                                    "pointer-events-none hidden select-none self-start text-[clamp(7rem,13vw,12rem)] font-extralight leading-[0.8] tracking-[-0.06em] tabular-nums transition-colors duration-1000 ease-out-soft lg:row-start-1 lg:block rtl:tracking-normal",
                                    far ? "lg:col-start-1 lg:text-end" : "lg:col-start-3",
                                    lit ? "text-teal-200" : "text-line",
                                )}
                            >
                                {pad(index + 1)}
                            </span>
                        </motion.li>
                    );
                })}
            </ol>
        </div>
    );
}
