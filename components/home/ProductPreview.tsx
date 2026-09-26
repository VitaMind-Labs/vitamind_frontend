"use client";

import { BrandLogo } from "@/components/shared/BrandLogo";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import {
    Activity,
    ArrowUpRight,
    BookOpen,
    Compass,
    HeartPulse,
    LayoutDashboard,
    Leaf,
    Lightbulb,
    Lock,
    SendHorizontal,
    Settings,
    ShieldCheck,
} from "lucide-react";
import { useEffect, useRef } from "react";

const SIDEBAR_ICONS = [LayoutDashboard, Activity, HeartPulse, BookOpen, Settings] as const;
const TREND = [42, 48, 45, 56, 52, 61, 57, 66, 62, 71, 68, 78];
const SCORE = 92;

/* ───────────── small building blocks ───────────── */

function CountUp({ to, start }: { to: number; start: boolean }) {
    const reduce = useReducedMotion();
    const value = useMotionValue(reduce ? to : 0);
    const rounded = useTransform(value, (v) => Math.round(v));

    useEffect(() => {
        if (!start || reduce) return;
        const controls = animate(value, to, { duration: 1.6, ease: EASE_OUT, delay: 0.3 });
        return () => controls.stop();
    }, [start, reduce, to, value]);

    return <motion.span>{rounded}</motion.span>;
}

function ScoreRing({ start }: { start: boolean }) {
    const r = 30;
    const c = 2 * Math.PI * r;
    return (
        <svg viewBox="0 0 72 72" className="h-[4.5rem] w-[4.5rem] -rotate-90" aria-hidden>
            <circle cx="36" cy="36" r={r} fill="none" stroke="var(--color-teal-100)" strokeWidth="6" />
            <motion.circle
                cx="36"
                cy="36"
                r={r}
                fill="none"
                stroke="var(--color-teal-500)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={c}
                initial={{ strokeDashoffset: c }}
                animate={start ? { strokeDashoffset: c * (1 - SCORE / 100) } : undefined}
                transition={{ duration: 1.6, delay: 0.3, ease: EASE_OUT }}
            />
        </svg>
    );
}

/** Catmull-Rom → cubic Bézier for a calm, continuous trend line. */
function smoothPath(points: [number, number][]) {
    return points.reduce((d, p, i, all) => {
        if (i === 0) return `M ${p[0]} ${p[1]}`;
        const p0 = all[i - 2] ?? all[i - 1];
        const p1 = all[i - 1];
        const p3 = all[i + 1] ?? p;
        const c1: [number, number] = [p1[0] + (p[0] - p0[0]) / 6, p1[1] + (p[1] - p0[1]) / 6];
        const c2: [number, number] = [p[0] - (p3[0] - p1[0]) / 6, p[1] - (p3[1] - p1[1]) / 6];
        return `${d} C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p[0]} ${p[1]}`;
    }, "");
}

function TrendChart({ start }: { start: boolean }) {
    const W = 240;
    const H = 84;
    const points = TREND.map((v, i): [number, number] => [
        Math.round((i / (TREND.length - 1)) * (W - 8)) + 4,
        Math.round(H - 6 - ((v - 35) / 50) * (H - 16)),
    ]);
    const line = smoothPath(points);
    const area = `${line} L ${points[points.length - 1][0]} ${H} L ${points[0][0]} ${H} Z`;
    const last = points[points.length - 1];

    return (
        // SVG coordinates are direction-independent: the series reads left → right in every language.
        <svg viewBox={`0 0 ${W} ${H}`} className="h-24 w-full overflow-visible" aria-hidden>
            {[0.25, 0.5, 0.75].map((f) => (
                <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="var(--color-line)" strokeWidth="1" />
            ))}
            <motion.path
                d={area}
                fill="var(--color-teal-500)"
                initial={{ opacity: 0 }}
                animate={start ? { opacity: 0.1 } : undefined}
                transition={{ duration: 0.8, delay: 1.2 }}
            />
            <motion.path
                d={line}
                fill="none"
                stroke="var(--color-teal-600)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={start ? { pathLength: 1 } : undefined}
                transition={{ duration: 1.6, delay: 0.3, ease: EASE_OUT }}
            />
            <motion.circle
                cx={last[0]}
                cy={last[1]}
                r="4.5"
                fill="var(--color-teal-600)"
                stroke="#fff"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={start ? { scale: 1 } : undefined}
                transition={{ duration: 0.4, delay: 1.8, ease: EASE_OUT }}
            />
        </svg>
    );
}

function Reveal({ start, delay, className, children }: { start: boolean; delay: number; className?: string; children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={start ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.55, delay, ease: EASE_OUT }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ───────────── the app window ───────────── */

/**
 * A faithful, decorative miniature of the VitaMind app used as the hero's product shot:
 * sidebar · live Mira assessment · wellbeing overview. Everything animates once, in sequence,
 * the first time it scrolls into view.
 */
export function ProductPreview() {
    const { dictionary } = useLanguage();
    const hero = dictionary.homeLanding.hero;
    const app = dictionary.homeLanding.app;
    const ref = useRef<HTMLDivElement>(null);
    const start = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });

    return (
        <div
            ref={ref}
            aria-hidden
            className="relative overflow-hidden rounded-[1.25rem] border border-white bg-white shadow-float ring-1 ring-ink/[0.06] md:rounded-[1.75rem]"
        >
            {/* Window chrome */}
            <div className="flex items-center gap-3 border-b border-line bg-surface-muted/80 px-4 py-2.5 md:px-5">
                <div className="flex gap-1.5">
                    {[0, 1, 2].map((dot) => (
                        <span key={dot} className="h-2.5 w-2.5 rounded-full bg-line-strong" />
                    ))}
                </div>
                <div className="mx-auto flex h-7 w-full max-w-xs items-center justify-center gap-2 rounded-lg border border-line bg-white px-3" dir="ltr">
                    <Lock className="h-3 w-3 text-sage-700" />
                    <span className="truncate text-[0.6875rem] text-ink-muted">vitamindspace.com/diagnostic</span>
                </div>
                <span className="hidden w-[42px] sm:block" />
            </div>

            <div className="grid md:grid-cols-[12.5rem_minmax(0,1fr)] lg:grid-cols-[13rem_minmax(0,1fr)_16.5rem]">
                {/* Sidebar */}
                <aside className="hidden flex-col border-e border-line bg-surface-muted/50 p-4 md:flex">
                    <BrandLogo size="sm" href={null} priority={false} className="ms-1" />
                    <nav className="mt-6 space-y-1">
                        {hero.dashboard.map((item, i) => {
                            const Icon = SIDEBAR_ICONS[i] ?? LayoutDashboard;
                            return (
                                <div
                                    key={item}
                                    className={cn(
                                        "flex items-center gap-2.5 rounded-xl px-3 py-2 text-[0.8125rem]",
                                        i === 0 ? "bg-white font-medium text-teal-800 shadow-xs ring-1 ring-line" : "text-ink-muted",
                                    )}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span className="truncate">{item}</span>
                                </div>
                            );
                        })}
                    </nav>
                    <div className="mt-auto flex items-center gap-2 rounded-xl bg-sage-50 px-3 py-2.5 text-[0.6875rem] font-medium text-sage-700">
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{app.private}</span>
                    </div>
                </aside>

                {/* Live assessment */}
                <section className="flex min-w-0 flex-col p-4 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-base font-semibold text-ink sm:text-lg">{app.greeting}</p>
                            <p className="text-xs text-ink-muted">{app.greetingSub}</p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-[0.6875rem] font-medium text-teal-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                            {app.chapterLabel} · {app.chapter}
                        </span>
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center justify-between text-[0.6875rem] text-ink-muted">
                            <span>{app.assessment}</span>
                            <span className="font-semibold tabular-nums text-ink">72%</span>
                        </div>
                        <div className="mt-1.5 flex gap-1">
                            {[1, 1, 0.88, 0].map((fill, i) => (
                                <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-teal-100">
                                    <motion.span
                                        className="block h-full origin-left rounded-full bg-teal-500 rtl:origin-right"
                                        initial={{ scaleX: 0 }}
                                        animate={start ? { scaleX: fill } : undefined}
                                        transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: EASE_OUT }}
                                    />
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5 flex-1 space-y-4 rounded-2xl border border-line bg-canvas/70 p-4 sm:p-5">
                        <Reveal start={start} delay={0.5} className="flex gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-teal-500),var(--color-teal-700))] text-white shadow-brand">
                                <Leaf className="h-3.5 w-3.5" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-[0.6875rem] font-semibold text-ink">{dictionary.diagnostic.miraLabel}</p>
                                <p className="mt-1 text-sm leading-6 text-ink sm:text-[0.9375rem]">{app.question}</p>
                            </div>
                        </Reveal>

                        <Reveal start={start} delay={1.1} className="flex justify-end">
                            <p className="max-w-[85%] rounded-2xl rounded-se-md border border-teal-100 bg-teal-50 px-3.5 py-2.5 text-[0.8125rem] leading-6 text-ink">
                                {app.answer}
                            </p>
                        </Reveal>

                        <Reveal start={start} delay={1.7} className="flex items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                                <Leaf className="h-3.5 w-3.5" />
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 ring-1 ring-line">
                                <span className="flex gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <motion.span
                                            key={i}
                                            className="h-1.5 w-1.5 rounded-full bg-teal-500"
                                            animate={start ? { opacity: [0.3, 1, 0.3] } : undefined}
                                            transition={{ duration: 1.1, repeat: Infinity, delay: 1.8 + i * 0.18 }}
                                        />
                                    ))}
                                </span>
                                <span className="text-[0.6875rem] text-ink-muted">{app.typing}</span>
                            </span>
                        </Reveal>
                    </div>

                    <div className="mt-4 flex items-center gap-2 rounded-2xl border border-line-strong bg-white p-1.5 ps-4">
                        <span className="min-w-0 flex-1 truncate text-sm text-ink-subtle">{app.composer}</span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-brand">
                            <SendHorizontal className="h-4 w-4 rtl:-scale-x-100" />
                        </span>
                    </div>

                    {/* Compact overview for narrow frames */}
                    <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-2xl border border-line p-3 lg:hidden">
                        <div className="relative">
                            <ScoreRing start={start} />
                            <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold tabular-nums text-ink">
                                <CountUp to={SCORE} start={start} />
                            </span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-ink-muted">{app.scoreLabel}</p>
                            <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-ink">
                                <Lightbulb className="h-3.5 w-3.5 shrink-0 text-gold-600" />
                                <span className="truncate">{app.insightTitle}</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Overview column */}
                <aside className="hidden flex-col gap-4 border-s border-line bg-surface-muted/30 p-5 lg:flex">
                    <Reveal start={start} delay={0.2} className="rounded-2xl border border-line bg-white p-4 shadow-xs">
                        <div className="flex items-center gap-3.5">
                            <div className="relative shrink-0">
                                <ScoreRing start={start} />
                                <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold tabular-nums text-ink">
                                    <CountUp to={SCORE} start={start} />
                                </span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-ink-muted">{app.scoreLabel}</p>
                                <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-sage-50 px-2 py-0.5 text-[0.6875rem] font-semibold text-sage-700">
                                    <ArrowUpRight className="h-3 w-3 rtl:-scale-x-100" />
                                    {hero.scoreChange}
                                </p>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal start={start} delay={0.35} className="rounded-2xl border border-line bg-white p-4 shadow-xs">
                        <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-ink">{app.trendLabel}</p>
                                <p className="text-[0.6875rem] text-ink-muted">{hero.last30}</p>
                            </div>
                            <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[0.6875rem] font-medium text-teal-800">{hero.stable}</span>
                        </div>
                        <div className="mt-3">
                            <TrendChart start={start} />
                        </div>
                    </Reveal>

                    <Reveal start={start} delay={2.1} className="rounded-2xl border border-gold-100 bg-gold-50/70 p-4">
                        <p className="flex items-center gap-2 text-xs font-semibold text-ink">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-gold-700 ring-1 ring-gold-100">
                                <Lightbulb className="h-3.5 w-3.5" />
                            </span>
                            {app.insightTitle}
                        </p>
                        <p className="mt-2 text-[0.75rem] leading-5 text-ink-soft">{app.insightBody}</p>
                        <p className="mt-3 flex items-center gap-1.5 border-t border-gold-100 pt-3 text-[0.6875rem] font-medium text-teal-800">
                            <Compass className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{app.nextStepBody}</span>
                        </p>
                    </Reveal>
                </aside>
            </div>
        </div>
    );
}
