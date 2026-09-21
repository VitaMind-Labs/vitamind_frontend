"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { MagneticButton } from "./AnimationUtilities";
import Image from "next/image";

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            const sections = ["home", "features", "how-it-works", "pricing", "cta"];
            for (const section of [...sections].reverse()) {
                const el = document.getElementById(section);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 200) { setActiveSection(section); break; }
                }
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "Home", href: "#home" },
        { label: "Features", href: "#features" },
        { label: "Process", href: "#how-it-works" },
        { label: "Pricing", href: "#pricing" },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-6"}`}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className={`flex items-center justify-between rounded-full px-2 py-2 transition-all duration-500 border ${scrolled ? "glass border-gray-200/60 shadow-lg shadow-black/5" : "bg-white/50 backdrop-blur-md border-transparent"}`}>
                        <div className="relative overflow-hidden  rounded-2xl   p-2 shadow-sm">
                            <Image
                                src="/logo.png"
                                alt="VitaMind Logo"
                                width={42}
                                height={42}
                                className="h-8 w-8 object-cover  md:h-9 md:w-9"
                                priority
                            />
                        </div>

                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeSection === link.href.slice(1) ? "text-[#518591]" : "text-gray-600 hover:text-gray-900"}`}
                                >
                                    {link.label}
                                    {activeSection === link.href.slice(1) && (
                                        <motion.div layoutId="nav-pill" className="absolute inset-0 bg-[#518591]/10 rounded-full -z-10" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                                    )}
                                </a>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 pr-2">
                            <MagneticButton
                                className="
    group
    relative
    hidden
    md:flex
    items-center
    gap-2
    overflow-hidden
    rounded-full
    px-5
    py-2.5
    text-[12px]
    font-semibold
    uppercase
    tracking-[0.18em]
    text-white
    transition-all
    duration-500
    magnetic-area
    hover:scale-[1.03]
    active:scale-[0.98]
    "
                                style={{
                                    background:
                                        "linear-gradient(135deg, hsl(187,27%,40%), hsl(45,93%,47%))",
                                    boxShadow:
                                        "0 10px 30px rgba(81,133,145,0.25)",
                                }}
                            >
                                {/* Glow effect */}
                                <div
                                    className="
        absolute
        inset-0
        opacity-0
        group-hover:opacity-100
        transition-opacity
        duration-500
        bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.35),transparent_70%)]
        "
                                />

                                {/* Shine animation */}
                                <div
                                    className="
        absolute
        top-0
        left-[-120%]
        h-full
        w-[120%]
        rotate-12
        bg-gradient-to-r
        from-transparent
        via-white/20
        to-transparent
        transition-all
        duration-1000
        group-hover:left-[120%]
        "
                                />

                                <span className="relative z-10">
                                    Get Started
                                </span>

                                <ArrowUpRight
                                    size={16}
                                    className="
        relative
        z-10
        transition-transform
        duration-300
        group-hover:translate-x-1
        group-hover:-translate-y-1
        "
                                />
                            </MagneticButton>
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors">
                                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-x-4 top-24 z-40 md:hidden glass rounded-3xl border border-gray-200/80 shadow-2xl p-6"
                    >
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                                    {link.label}
                                </a>
                            ))}
                            <button className="mt-2 w-full py-3 rounded-xl bg-gray-900 text-white font-medium">Get Started</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
