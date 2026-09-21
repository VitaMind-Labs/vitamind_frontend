"use client";

import { motion } from "framer-motion";
import {
    createStaggerContainer,
    createStaggerItem,
    getCardHover,
    getRevealProps,
} from "../animations";

// ─── DONNÉES ──────────────────────────────────────────────────────────────────
const steps = [
    {
        number: "01",
        id: "Step 1",
        title: "Smart Behavioral Capture",
        description:
            "Mira AI understands emotional patterns through interactions, behavioral signals and adaptive intelligence.",
        accent: "#518591",
        glow: "rgba(81,133,145,0.16)",
    },
    {
        number: "02",
        id: "Step 2",
        title: "Clinical Screening",
        description:
            "Validated psychiatric frameworks designed for early detection and behavioral analysis.",
        accent: "#e3b01c",
        glow: "rgba(227,176,28,0.16)",
    },
    {
        number: "03",
        id: "Step 3",
        title: "Lumina Stabilization",
        description:
            "Adaptive visual experiences helping users reduce emotional overload in real time.",
        accent: "#2c3e3b",
        glow: "rgba(44,62,59,0.14)",
    },
];

// ─── ICÔNES PAR ÉTAPE ─────────────────────────────────────────────────────────
const StepIcon = ({ index }: { index: number }) => {
    const icons = [
        // Step 1 — cerveau / capture
        <svg key="1" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="#518591" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="2" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="22" y2="12" />
        </svg>,
        // Step 2 — analyse clinique
        <svg key="2" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="#518591" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.66 0 3.21.45 4.55 1.23" />
        </svg>,
        // Step 3 — stabilisation
        <svg key="3" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="#518591" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
        </svg>,
    ];
    return icons[index] ?? icons[0];
};

export default function WorkflowSection() {
    const cardVariants = createStaggerItem({ y: 34, blur: 10, duration: 0.8 });

    return (
        <section className="w-full overflow-hidden py-16 md:py-24">
            {/* ── CONTENEUR PRINCIPAL ──
                CORRECTION : bordure animée via CSS keyframes inline → remplacée
                par une bordure statique élégante + box-shadow layered.
                Le borderRadius passe de 50px (trop agressif) à 28px (harmonieux).   */}
            <div
                className="relative mx-auto overflow-hidden px-6 sm:px-8 lg:px-12"
                style={{
                    borderRadius: "28px",
                    border: "1.5px solid rgba(81,133,145,0.20)",
                    background:
                        "linear-gradient(160deg, #ffffff 0%, #f8fafc 60%, #f1f5f9 100%)",
                    boxShadow:
                        "0 2px 40px -8px rgba(81,133,145,0.10), 0 1px 8px -2px rgba(0,0,0,0.04)",
                }}
            >
                {/* Halo d'ambiance centré — remplace les deux divs blur empilés */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                    style={{ borderRadius: "inherit" }}
                >
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: 0,
                            width: "700px",
                            height: "500px",
                            transform: "translate(-50%, -35%)",
                            background:
                                "radial-gradient(ellipse, rgba(81,133,145,0.07) 0%, transparent 70%)",
                            filter: "blur(60px)",
                        }}
                    />
                </div>

                {/* ── CONTENU ── */}
                <div className="relative z-10 px-2 py-16 sm:px-4 lg:px-10">

                    {/* En-tête */}
                    <motion.div
                        {...getRevealProps({ y: 22, blur: 10, duration: 0.95 })}
                        className="mb-16 text-center"
                    >
                        {/* Label */}
                        <motion.p
                            {...getRevealProps({ delay: 0.08, y: 12, blur: 6, duration: 0.7 })}
                            className="font-body mb-4 text-[12px] font-semibold uppercase tracking-[0.32em]"
                            style={{ color: "#518591" }}
                        >
                            Intelligent Process
                        </motion.p>

                        {/* H2 — CORRECTION : taille unifiée avec TechnologiesSection */}
                        <h2
                            className="
                                font-display
                                mb-5
                                text-[clamp(30px,4.5vw,56px)]
                                leading-[1.08]
                                tracking-[-0.025em]
                                font-light
                            "
                            style={{ color: "#0f172a" }}
                        >
                            Our Working{" "}
                            {/* CORRECTION : gradient text uniquement sur ce mot-clé */}
                            <span
                                className="inline-block"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(135deg, #518591 0%, #2c3e3b 50%, #e3b01c 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                Flow
                            </span>
                        </h2>

                        <p
                            className="font-body mx-auto max-w-xl text-[16px] leading-[1.65]"
                            style={{ color: "#475569" }}
                        >
                            Structured workflows designed to create a smooth, intelligent,
                            and emotionally adaptive healthcare experience.
                        </p>
                    </motion.div>

                    {/* ── GRILLE DE CARTES ──
                        CORRECTION : minHeight fixe supprimé → les cartes s'adaptent
                        au contenu et restent à hauteur égale via align-items: stretch    */}
                    <motion.div
                        variants={createStaggerContainer({ delayChildren: 0.08, staggerChildren: 0.12 })}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        className="relative grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
                    >
                        <div
                            aria-hidden="true"
                            className="absolute left-[16%] right-[16%] top-[4.65rem] hidden h-px md:block"
                            style={{
                                background:
                                    "linear-gradient(to right, rgba(81,133,145,0.15), rgba(227,176,28,0.35), rgba(44,62,59,0.15))",
                            }}
                        />
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.id}
                                variants={cardVariants}
                                transition={{ delay: i * 0.08 }}
                                whileHover={getCardHover()}
                                className="group relative flex flex-col overflow-hidden"
                                style={{
                                    borderRadius: "20px",
                                    background:
                                        "linear-gradient(165deg, #ffffff 0%, #f8fafc 100%)",
                                    border: "1px solid rgba(81,133,145,0.12)",
                                    boxShadow:
                                        "0 4px 24px -8px rgba(0,0,0,0.07)",
                                    marginTop: i === 1 ? "26px" : i === 2 ? "52px" : "0px",
                                }}
                            >
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-x-0 top-0 h-px"
                                    style={{
                                        background: `linear-gradient(to right, transparent, ${step.accent}, transparent)`,
                                    }}
                                />
                                <div
                                    aria-hidden="true"
                                    className="absolute -right-10 top-10 h-28 w-28 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                    style={{ background: step.glow }}
                                />
                                <div className="relative z-10 flex flex-col h-full p-8 lg:p-9">

                                    {/* ── TOP : icône + numéro ── */}
                                    <div className="flex items-start justify-between mb-8">
                                        {/* Icône */}
                                        <div
                                            className="relative flex h-14 w-14 items-center justify-center flex-shrink-0 transition-transform duration-400 group-hover:scale-105"
                                            style={{
                                                borderRadius: "14px",
                                                background:
                                                    `linear-gradient(135deg, ${step.glow}, rgba(255,255,255,0.42))`,
                                                border: "1px solid rgba(81,133,145,0.14)",
                                            }}
                                        >
                                            <span
                                                className="absolute -right-10 top-1/2 hidden h-[2px] w-10 -translate-y-1/2 md:block"
                                                style={{
                                                    background: `linear-gradient(to right, ${step.accent}, transparent)`,
                                                    opacity: i === steps.length - 1 ? 0 : 1,
                                                }}
                                            />
                                            <StepIcon index={i} />
                                        </div>

                                        {/* Numéro — CORRECTION : un seul style, pas de gradient */}
                                        <span
                                            className="font-display font-light text-[13px] tracking-[0.18em]"
                                            style={{ color: step.accent }}
                                        >
                                            {step.number}
                                        </span>
                                    </div>

                                    {/* ── CORPS ── */}
                                    <div className="flex flex-col flex-1">
                                        {/* Ligne décorative — s'étend au hover */}
                                        <div
                                            className="mb-5 h-px transition-all duration-500 group-hover:w-20"
                                            style={{
                                                width: "40px",
                                                backgroundImage: `linear-gradient(to right, ${step.accent}, #e3b01c)`,
                                            }}
                                        />

                                        {/* Label étape — CORRECTION : suppression gradient text ici */}
                                        <span
                                            className="font-body text-[12px] font-semibold uppercase tracking-[0.22em] mb-3"
                                            style={{ color: step.accent }}
                                        >
                                            {step.id}
                                        </span>

                                        {/* Titre carte — CORRECTION : font-display, taille fixe */}
                                        <h4
                                            className="font-display text-[20px] font-medium leading-snug mb-4"
                                            style={{ color: "#0f172a" }}
                                        >
                                            {step.title}
                                        </h4>

                                        {/* Description */}
                                        <p
                                            className="font-body text-[15px] leading-[1.65] flex-1"
                                            style={{ color: "#475569" }}
                                        >
                                            {step.description}
                                        </p>

                                        {/* Badge bas — CORRECTION : taille et style unifiés */}
                                        <div
                                            className="
                                                inline-flex self-start items-center gap-2 mt-6
                                                rounded-full px-4 py-[7px]
                                                font-body text-[12px] font-medium
                                                transition-transform duration-400 group-hover:-translate-y-1
                                            "
                                            style={{
                                                background: `${step.glow}`,
                                                border: "1px solid rgba(81,133,145,0.12)",
                                                color: step.accent,
                                            }}
                                        >
                                            <span
                                                className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                                                style={{ background: step.accent }}
                                            />
                                            Intelligent system flow
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
