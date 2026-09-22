"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";
import { MagneticButton } from "./AnimationUtilities";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { dictionary, direction } = useLanguage();
  const copy = dictionary.homeLanding;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
      const sections = ["home", "features", "how-it-works", "pricing", "cta"];
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: copy.nav.home, href: "#home" },
    { label: copy.nav.features, href: "#features" },
    { label: copy.nav.process, href: "#how-it-works" },
    { label: copy.nav.pricing, href: "#pricing" },
  ];

  return (
    <>
      <motion.nav
        dir={direction}
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "py-2 sm:py-3" : "py-3 sm:py-6"}`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between gap-2 rounded-full px-2 sm:px-3 py-2 sm:py-2.5 transition-all duration-300 border backdrop-blur-2xl ${
              scrolled
                ? "bg-white/85 border-white/70 shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
                : "bg-white/60 border-white/50 shadow-[0_8px_32px_rgba(15,23,42,0.06)]"
            }`}
          >
            {/* Logo — text removed per request (no VitaMind/Care near logo, both languages) */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-primary" aria-label="VitaMind">
              <span className="relative flex items-center justify-center rounded-2xl bg-white p-1.5 sm:p-2 shadow-sm border border-white/60">
                <Image src="/logo.png" alt="Logo" width={42} height={42} className="h-7 w-7 sm:h-8 sm:w-8 object-contain md:h-9 md:w-9" priority />
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative px-3 xl:px-4 py-2 text-[13px] font-medium rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                    activeSection === link.href.slice(1) ? "text-primary" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                  {activeSection === link.href.slice(1) && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 340, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Language - hide on very small, keep visible */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              <MagneticButton
                className="group relative hidden sm:flex items-center gap-2 overflow-hidden rounded-full px-4 lg:px-5 py-2.5 text-[11px] lg:text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                style={{
                  background: "linear-gradient(135deg, hsl(187,27%,40%), hsl(45,93%,47%))",
                  boxShadow: "0 10px 30px rgba(81,133,145,0.28)",
                }}
              >
                <Link href="/diagnostic" className="relative z-10 flex items-center gap-2">
                  <span>{copy.nav.getStarted}</span>
                  <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-180" />
                </Link>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.28),transparent_70%)]" aria-hidden />
                <span
                  className="absolute top-0 left-[-120%] h-full w-[120%] rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 group-hover:left-[120%]"
                  aria-hidden
                />
              </MagneticButton>

              {/* Diagnostic short CTA for very small screens */}
              <Link
                href="/diagnostic"
                className="sm:hidden flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-[0_6px_16px_rgba(81,133,145,0.25)] focus-visible:outline-2 focus-visible:outline-primary"
                aria-label={copy.nav.getStarted}
              >
                <ArrowUpRight size={16} className="rtl:rotate-180" />
              </Link>

              <button
                aria-label={mobileMenuOpen ? copy.nav.close : copy.nav.menu}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex lg:hidden h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/70 text-gray-700 backdrop-blur-md transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-primary"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-[#0f1f1d]/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden
            />
            <motion.div
              dir={direction}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-3 top-[72px] sm:inset-x-4 sm:top-[78px] z-40 lg:hidden rounded-[22px] border border-white/60 bg-white/90 shadow-[0_16px_48px_rgba(15,23,42,0.14)] backdrop-blur-2xl overflow-hidden"
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">{copy.nav.menu}</p>
                  <div className="sm:hidden">
                    <LanguageSwitcher />
                  </div>
                </div>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      {link.label}
                      <ArrowUpRight size={14} className="text-gray-300 rtl:rotate-180" aria-hidden />
                    </a>
                  ))}
                </nav>

                <div className="mt-4 space-y-3">
                  <Link
                    href="/diagnostic"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(81,133,145,0.25)] transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {copy.nav.getStarted}
                    <ArrowUpRight size={16} className="rtl:rotate-180" aria-hidden />
                  </Link>
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:border-primary/20 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {dictionary.nav.signIn}
                  </Link>
                  <div className="hidden sm:flex items-center justify-center pt-2">
                    <LanguageSwitcher />
                  </div>
                </div>

                <p className="mt-4 text-center text-[11px] leading-4 text-gray-400 px-2">{dictionary.home.disclaimer}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
