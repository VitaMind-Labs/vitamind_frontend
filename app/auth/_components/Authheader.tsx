"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

export default function AuthHeader() {
    const { dictionary } = useLanguage();
    const nav = dictionary.nav;

    return (
        <header className="relative w-full z-10 px-3 sm:px-4 py-3 sm:py-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto flex h-[60px] sm:h-[68px] w-full max-w-[1380px] items-center justify-between rounded-full px-4 md:px-7"
                style={{
                    background: "rgba(255,255,255,0.80)",
                    border: "1px solid rgba(255,255,255,0.28)",
                    boxShadow: "0 8px 28px rgba(15,23,42,0.07)",
                    backdropFilter: "blur(20px)",
                }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    className="group relative flex items-center gap-2 sm:gap-3 transition-opacity duration-200 hover:opacity-90"
                >
                    {/* Hover glow effect */}
                    <div
                        className="absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10"
                        style={{
                            background:
                                "radial-gradient(circle at center, rgba(81,133,145,0.08), transparent 70%)",
                        }}
                    />

                    <div
                        className="relative p-1.5 sm:p-2 flex-shrink-0"
                        style={{
                            borderRadius: "14px",
                            border: "1px solid rgba(255,255,255,0.22)",
                            background: "white",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        }}
                    >
                        <Image
                            src="/logo.png"
                            alt="VitaMind"
                            width={36}
                            height={36}
                            className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
                            priority
                        />
                    </div>
                    <span
                        className="font-display text-[14px] sm:text-[16px] font-light tracking-[-0.02em] hidden xs:block"
                        style={{ color: "#2c3e3b" }}
                    >
                        VitaMind
                    </span>
                </Link>

                {/* Right: langue + CTA */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <LanguageSwitcher />

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                            href="/diagnostic"
                            className="group relative flex items-center gap-1.5 sm:gap-2 overflow-hidden rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.18em] text-white transition-all duration-300"
                            style={{
                                background:
                                    "linear-gradient(135deg, hsl(187,27%,40%), hsl(45,93%,47%))",
                                boxShadow:
                                    "0 6px 20px rgba(81,133,145,0.22)",
                            }}
                        >
                            <span
                                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                style={{
                                    background:
                                        "radial-gradient(circle at center, rgba(255,255,255,0.20), transparent 62%)",
                                }}
                            />
                            <span className="relative z-10 font-body whitespace-nowrap">
                                {nav?.diagnostic ?? "Start Assessment"}
                            </span>
                            <ArrowUpRight className="relative z-10 h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </header>
    );
}