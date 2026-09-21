"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ambientFloat,
    ambientFloatTransition,
    buttonTap,
    getButtonHover,
    getRevealProps,
} from "../animations";

const NAV_LINKS = ["Platform", "Technology", "Company", "Newsroom"];
const INFRA_ITEMS = [
    "AI Behavioral Monitoring",
    "Encrypted Clinical Infrastructure",
    "Adaptive Intelligence Systems",
];

export default function FooterSection() {
    return (
        <footer
            className="relative overflow-hidden px-6 py-14 md:px-10 md:py-20"
            style={{
                /*
                    CORRECTIONS :
                    - rounded-[50px] → 24px, cohérent avec toutes les sections
                    - border animée (rotatingBorder via style jsx) → bordure statique
                    - suppression complète du bloc <style jsx>
                    - bg-white → conservé (le footer doit trancher sur le fond crème)
                */
                borderRadius: "24px",
                border: "1.5px solid rgba(81,133,145,0.18)",
                background: "#ffffff",
                boxShadow: "0 2px 40px -8px rgba(44,62,59,0.06)",
            }}
        >
            {/* ── HALOS D'AMBIANCE ── */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" style={{ borderRadius: "inherit" }}>
                <div
                    className="absolute -top-32 left-10 h-[320px] w-[320px] rounded-full blur-[100px]"
                    style={{ background: "rgba(227,176,28,0.08)" }}
                />
                <motion.div
                    animate={ambientFloat}
                    transition={{ ...ambientFloatTransition, duration: 16 }}
                    className="absolute -bottom-20 right-10 h-[320px] w-[320px] rounded-full blur-[100px]"
                    style={{ background: "rgba(81,133,145,0.08)" }}
                />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl">

                {/* ── TOP : headline + bouton CTA ── */}
                <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">

                    {/* Gauche */}
                    <motion.div
                        {...getRevealProps({ x: -24, y: 0, blur: 10, duration: 0.95 })}
                        className="max-w-2xl"
                    >
                        <span
                            className="font-body inline-block text-[11px] font-semibold uppercase tracking-[0.32em]"
                            style={{
                                backgroundImage:
                                    "linear-gradient(to right, #518591, #2c3e3b, #e3b01c)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            VitaMind Biosciences
                        </span>

                        <h2
                            className="font-display font-light tracking-[-0.03em] mt-5"
                            style={{
                                fontSize: "clamp(30px, 4vw, 56px)",
                                lineHeight: 1.05,
                                color: "#0f172a",
                            }}
                        >
                            Designed for calmer, more{" "}
                            <span
                                style={{
                                    backgroundImage:
                                        "linear-gradient(135deg, #518591, #2c3e3b, #e3b01c)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                trustworthy
                            </span>
                            {" "}mental healthcare.
                        </h2>

                        <p
                            className="font-body mt-6 max-w-xl text-[15px] leading-[1.75]"
                            style={{ color: "rgba(44,62,59,0.62)" }}
                        >
                            Intelligent behavioral systems combining adaptive AI,
                            clinical collaboration, and privacy-first infrastructure.
                        </p>

                        <p
                            className="font-body mt-5 max-w-2xl text-[13px] leading-[1.8]"
                            style={{ color: "rgba(44,62,59,0.48)" }}
                        >
                            VitaMind does not diagnose, prescribe, or replace licensed clinicians.
                            It helps users prepare for care, structure information, and navigate
                            support with more clarity between appointments.
                        </p>

                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "88px" }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.35, duration: 0.9, ease: "easeInOut" }}
                            className="mt-6 h-[2px] rounded-full"
                            style={{
                                background:
                                    "linear-gradient(to right, #e3b01c, #518591)",
                            }}
                        />
                    </motion.div>

                    <motion.div
                        {...getRevealProps({ delay: 0.18, y: 18, scale: 0.9, blur: 8, duration: 0.8 })}
                        whileHover={getButtonHover(0, 1.08)}
                        whileTap={buttonTap}
                    >
                        <Link
                            href="/diagnostic"
                            aria-label="Get started"
                            className="group relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full"
                            style={{
                                background:
                                    "linear-gradient(135deg, #518591, #2c3e3b, #e3b01c)",
                                boxShadow: "0 10px 28px rgba(81,133,145,0.18)",
                            }}
                        >
                            <ArrowUpRight className="relative z-10 h-5 w-5 text-white transition-transform duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                    </motion.div>
                </div>

                {/* ── CENTRE : colonnes nav / contact / infra ── */}
                <div
                    className="mt-14 grid grid-cols-1 gap-10 py-12 md:grid-cols-3"
                    style={{ borderTop: "1px solid rgba(81,133,145,0.10)", borderBottom: "1px solid rgba(81,133,145,0.10)" }}
                >
                    {/* Navigation */}
                    <motion.div
                        {...getRevealProps({ delay: 0.12, y: 18, blur: 8, duration: 0.8 })}
                    >
                        <p
                            className="font-body text-[11px] font-semibold uppercase tracking-[0.28em]"
                            style={{ color: "rgba(81,133,145,0.80)" }}
                        >
                            Navigation
                        </p>
                        <nav className="mt-6 flex flex-col gap-4">
                            {NAV_LINKS.map((item) => (
                                <a key={item} href="#" className="group flex items-center gap-3">
                                    <motion.div
                                        layout
                                        className="h-px transition-all duration-500 group-hover:w-7"
                                        style={{
                                            width: 0,
                                            background:
                                                "linear-gradient(to right, #e3b01c, #518591)",
                                        }}
                                    />
                                    <span
                                        className="font-body text-[15px] transition-colors duration-300 group-hover:text-[#2c3e3b]"
                                        style={{ color: "rgba(44,62,59,0.60)" }}
                                    >
                                        {item}
                                    </span>
                                </a>
                            ))}
                        </nav>
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        {...getRevealProps({ delay: 0.2, y: 18, blur: 8, duration: 0.8 })}
                    >
                        <p
                            className="font-body text-[11px] font-semibold uppercase tracking-[0.28em]"
                            style={{ color: "rgba(81,133,145,0.80)" }}
                        >
                            Contact
                        </p>
                        <div className="mt-6 space-y-4">
                            <a
                                href="mailto:contact@vitamind.ai"
                                className="font-body block text-[15px] transition-colors duration-300 hover:text-[#518591]"
                                style={{ color: "rgba(44,62,59,0.60)" }}
                            >
                                contact@vitamind.ai
                            </a>
                            <p
                                className="font-body text-[15px]"
                                style={{ color: "rgba(44,62,59,0.60)" }}
                            >
                                Tunisia
                            </p>
                        </div>
                    </motion.div>

                    {/* Infrastructure */}
                    <motion.div
                        {...getRevealProps({ delay: 0.28, y: 18, blur: 8, duration: 0.8 })}
                    >
                        <p
                            className="font-body text-[11px] font-semibold uppercase tracking-[0.28em]"
                            style={{ color: "rgba(81,133,145,0.80)" }}
                        >
                            Infrastructure
                        </p>
                        <div className="mt-6 space-y-4">
                            {INFRA_ITEMS.map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <motion.span
                                        whileHover={{ scale: 1.5 }}
                                        transition={{ duration: 0.25 }}
                                        className="h-2 w-2 flex-shrink-0 rounded-full"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #e3b01c, #518591)",
                                        }}
                                    />
                                    <span
                                        className="font-body text-[15px]"
                                        style={{ color: "rgba(44,62,59,0.60)" }}
                                    >
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── BAS : signature légère + mentions légales ── */}
                <div className="pt-10">
                    <motion.div
                        {...getRevealProps({ delay: 0.12, y: 20, blur: 10, duration: 0.9 })}
                        className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
                    >
                        <div>
                            <p
                                className="font-display text-[clamp(28px,3vw,40px)] font-light tracking-[-0.04em]"
                                style={{ color: "#2c3e3b" }}
                            >
                                VitaMind
                            </p>
                            <span
                                style={{
                                    backgroundImage:
                                        "linear-gradient(135deg, #518591, #2c3e3b, #e3b01c)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                Biosciences
                            </span>
                            <p
                                className="mt-2 font-body text-[14px] leading-relaxed"
                                style={{ color: "rgba(44,62,59,0.56)" }}
                            >
                                Calm interfaces, structured triage, and privacy-first infrastructure.
                            </p>
                        </div>
                        <p
                            className="font-body text-[12px] uppercase tracking-[0.22em]"
                            style={{ color: "rgba(81,133,145,0.55)" }}
                        >
                            Trustworthy AI for mental healthcare
                        </p>
                    </motion.div>

                    {/* Mentions légales */}
                    <motion.div
                        {...getRevealProps({ delay: 0.32, y: 16, blur: 8, duration: 0.8 })}
                        className="mt-8 flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between"
                        style={{ borderTop: "1px solid rgba(81,133,145,0.10)" }}
                    >
                        {/* CORRECTION : font-body */}
                        <p
                            className="font-body text-[13px]"
                            style={{ color: "rgba(44,62,59,0.42)" }}
                        >
                            © 2026 VitaMind Biosciences. All rights reserved.
                        </p>

                        <div className="flex items-center gap-7">
                            {["Privacy Policy", "Terms of Service"].map((label) => (
                                <a
                                    key={label}
                                    href="#"
                                    className="group relative font-body text-[13px] transition-colors duration-300 hover:text-[#518591]"
                                    style={{ color: "rgba(44,62,59,0.42)" }}
                                >
                                    {label}
                                    {/* Underline animée au hover */}
                                    <span
                                        className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-400 group-hover:w-full"
                                        style={{
                                            background:
                                                "linear-gradient(to right, #518591, #e3b01c)",
                                        }}
                                    />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
}
