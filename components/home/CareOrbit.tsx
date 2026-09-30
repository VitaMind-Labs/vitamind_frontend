"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { AgentAvatar } from "@/components/layout/site-header/AgentAvatar";
import { AGENTS } from "@/components/layout/site-header/agents";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Dots riding the orbits: [ring index, start angle, colour]. Purely decorative. */
const ORBIT_DOTS = [
    { ring: 0, angle: 20, className: "bg-gold" },
    { ring: 1, angle: 200, className: "bg-sage" },
    { ring: 2, angle: 110, className: "bg-teal-400" },
] as const;

/** Three slow concentric rings around the VitaMind mark. Rotation stops under reduced motion. */
function Core() {
    return (
        <div className="relative mx-auto grid aspect-square w-[min(17rem,72vw)] place-items-center lg:w-[19rem]" aria-hidden>
            {[100, 76, 52].map((size, ring) => (
                <span
                    key={size}
                    className={cn(
                        "absolute rounded-full border border-dashed motion-safe:animate-spin motion-reduce:animate-none",
                        ring === 0 ? "border-teal-200" : ring === 1 ? "border-gold-300/70" : "border-sage/50",
                    )}
                    style={{ width: `${size}%`, height: `${size}%`, animationDuration: `${38 - ring * 9}s`, animationDirection: ring === 1 ? "reverse" : "normal" }}
                >
                    {ORBIT_DOTS.filter((dot) => dot.ring === ring).map((dot) => (
                        <span
                            key={dot.angle}
                            className={cn("absolute size-2.5 rounded-full shadow-[0_0_0_4px_rgb(255_255_255/0.7)]", dot.className)}
                            style={{ left: `${50 + 50 * Math.cos((dot.angle * Math.PI) / 180)}%`, top: `${50 + 50 * Math.sin((dot.angle * Math.PI) / 180)}%`, transform: "translate(-50%,-50%)" }}
                        />
                    ))}
                </span>
            ))}
            <span className="absolute size-[42%] rounded-full bg-[radial-gradient(closest-side,rgb(227_176_28/0.28),rgb(81_133_145/0.18)_60%,transparent)] blur-xl" />
            <Image src="/assets/vitamind-mark-3d.png" alt="" width={220} height={220} priority className="relative size-[38%] object-contain drop-shadow-[0_18px_24px_rgb(47_83_90/0.28)]" />
        </div>
    );
}

function AgentTile({ id, index }: { id: (typeof AGENTS)[number]["id"]; index: number }) {
    const { dictionary } = useLanguage();
    const reduce = useReducedMotion();
    const agent = AGENTS.find((item) => item.id === id)!;
    const copy = dictionary.header.agents.items[id];
    const live = agent.status === "live";

    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, delay: 0.15 + index * 0.15, ease: EASE_OUT }}
        >
            <motion.div animate={reduce ? undefined : { y: [0, -6, 0] }} transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}>
                <Link
                    href={agent.href}
                    className="group relative flex h-full flex-col gap-4 rounded-[1.5rem] border border-white bg-white/90 p-5 text-start shadow-raised backdrop-blur transition-[transform,box-shadow] duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 sm:p-6"
                >
                    <span aria-hidden className={cn("absolute inset-x-6 top-0 h-0.5 rounded-full bg-gradient-to-r from-transparent to-transparent", live ? "via-teal-500" : "via-gold")} />
                    <div className="flex items-center gap-3.5">
                        <AgentAvatar agent={id} className={cn("size-14 ring-1 ring-line", agent.tone.ring, "transition-shadow")} />
                        <div className="min-w-0 flex-1">
                            <p className="text-lg font-semibold leading-tight text-ink">{copy.name}</p>
                            <p className="mt-0.5 text-sm text-ink-muted">{copy.role}</p>
                        </div>
                        <ArrowUpRight className="size-5 shrink-0 text-ink-subtle transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:text-teal-700 rtl:-scale-x-100 rtl:group-hover:translate-x-0.5" aria-hidden />
                    </div>

                    <p className="line-clamp-4 text-[0.9375rem] leading-6 text-ink-soft">{copy.description}</p>

                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
                        <span className={cn("home-label inline-flex items-center gap-1.5 rounded-full px-2.5 py-1", agent.tone.tint, agent.tone.text)}>
                            <span className="relative flex size-1.5">
                                {live && <span className={cn("absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping", agent.tone.dot)} />}
                                <span className={cn("relative inline-flex size-1.5 rounded-full", agent.tone.dot)} />
                            </span>
                            {copy.status}
                        </span>
                        <span className="text-xs text-ink-muted">{copy.meta}</span>
                    </div>
                </Link>
            </motion.div>
        </motion.div>
    );
}

/**
 * The hero's showcase: the two agents in orbit around VitaMind's mark, joined by a thread of light.
 * It says what the product is — one continuous care journey — without pretending to be a screenshot.
 */
export function CareOrbit() {
    return (
        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-[linear-gradient(160deg,rgb(255_255_255/0.95),rgb(241_246_246/0.9))] p-5 shadow-raised sm:p-8 lg:p-10">
            {/* Soft brand light behind the stage */}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_50%,rgb(81_133_145/0.14),transparent_70%),radial-gradient(30%_40%_at_95%_0%,rgb(227_176_28/0.12),transparent_70%),radial-gradient(30%_40%_at_0%_100%,rgb(125_168_158/0.16),transparent_70%)]" />

            <div className="relative grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-0">
                <AgentTile id="mira" index={0} />

                <div className="relative order-first lg:order-none">
                    {/* The thread of light joining both agents through the core (desktop). */}
                    <span aria-hidden className="absolute inset-x-[-2rem] top-1/2 hidden h-px bg-gradient-to-r from-teal-300/0 via-teal-300 to-gold/70 lg:block" />
                    <Core />
                </div>

                <AgentTile id="lumina" index={1} />
            </div>
        </div>
    );
}
