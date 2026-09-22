"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import {
    buttonTap,
    getButtonHover,
    getRevealProps,
} from "../animations";

const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "Solutions", href: "#solutions" },
  { label: "Workflow", href: "#discovery" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/home";
  const isSubscription = pathname.startsWith("/subscription");
  const showControls = !isHome && !isSubscription;
  const { dictionary, direction } = useLanguage();
  const mainNav = dictionary.nav;
  const homeNav = dictionary.homeLanding.nav;
  const nav = isHome ? homeNav : mainNav;
  const homeLinks = [
    { label: homeNav.home, href: "#home" },
    { label: homeNav.features, href: "#features" },
    { label: homeNav.process, href: "#how-it-works" },
    { label: homeNav.pricing, href: "#pricing" },
  ];
  const { scrollY } = useScroll();
  const headerScale = useTransform(scrollY, [0, 180], [1, 0.985]);
  const headerY = useTransform(scrollY, [0, 180], [0, -4]);
  const headerShadow = useTransform(
    scrollY,
    [0, 180],
    ["0 12px 32px rgba(15,23,42,0.06)", "0 24px 56px rgba(15,23,42,0.14)"]
  );
  const headerBackground = useTransform(
    scrollY,
    [0, 180],
    ["rgba(255,255,255,0.68)", "rgba(255,255,255,0.86)"]
  );

  return (
    <motion.header
      dir={direction}
      {...getRevealProps({ y: -18, blur: 12, duration: 1.05 })}
      className="fixed left-1/2 top-3 sm:top-5 z-50 w-full -translate-x-1/2 px-3 sm:px-4"
    >
      <motion.div
        style={{
          scale: headerScale,
          y: headerY,
          boxShadow: headerShadow,
          backgroundColor: headerBackground,
        }}
        className="mx-auto flex h-[60px] sm:h-[68px] md:h-[76px] w-full max-w-[1380px] items-center justify-between gap-2 rounded-full border border-white/30 px-2 sm:px-4 backdrop-blur-2xl md:px-6 lg:px-7"
      >
        {/* LEFT - Logo */}
        <Link href="/" className="group flex items-center gap-2 sm:gap-3 shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-primary">
          <span className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/20 bg-white p-1.5 sm:p-2 shadow-sm">
            <Image src="/logo.png" alt="VitaMind Logo" width={42} height={42} className="h-7 w-7 sm:h-8 sm:w-8 object-contain md:h-9 md:w-9" priority />
          </span>
          <span className="hidden sm:inline font-display text-sm font-bold tracking-tight text-[#2c3e3b]">VitaMind</span>
        </Link>

        {/* CENTER NAV */}
        {isHome ? (
          <nav className="hidden items-center gap-1 lg:flex">
            {homeLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group relative rounded-full px-4 xl:px-5 py-2 text-[13px] font-medium text-[hsl(222,47%,11%)]/70 transition-all duration-200 hover:bg-[hsl(45,93%,47%)]/10 hover:text-[hsl(187,27%,40%)] focus-visible:outline-2 focus-visible:outline-primary"
              >
                {item.label}
                <span className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-[hsl(45,93%,47%)] to-[hsl(187,27%,40%)] transition-all duration-300 group-hover:w-6" />
              </Link>
            ))}
          </nav>
        ) : (
          <nav className="hidden sm:flex items-center gap-1">
            <Link href="/" className="rounded-full px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
              {(nav as { home?: string }).home ?? mainNav.backHome ?? "Home"}
            </Link>
          </nav>
        )}

        {/* RIGHT */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Language always visible */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <div className="sm:hidden">
            {showControls && <LanguageSwitcher />}
          </div>

          {/* Login */}
          {!isSubscription && (
            <motion.div whileHover={getButtonHover(0, 1.01)} whileTap={buttonTap} className="hidden sm:block">
              <Link
                href="/auth/signin"
                className="hidden md:flex rounded-full border border-[hsl(187,27%,40%)]/20 bg-white px-4 lg:px-5 py-2 text-[13px] font-medium text-[hsl(187,27%,40%)] transition-all hover:border-[hsl(187,27%,40%)]/40 hover:bg-[hsl(187,27%,40%)]/5 focus-visible:outline-2 focus-visible:outline-primary"
              >
                {isHome ? (direction === "rtl" ? "تسجيل الدخول" : "Login") : mainNav.signIn || "Login"}
              </Link>
            </motion.div>
          )}

          {/* CTA */}
          {!isSubscription && (
            <motion.div whileHover={getButtonHover()} whileTap={buttonTap} className="hidden sm:block">
              <Link
                href="/diagnostic"
                className="group relative hidden sm:flex items-center gap-1.5 lg:gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[hsl(187,27%,40%)] to-[hsl(45,93%,47%)] px-4 lg:px-6 py-2.5 lg:py-3 text-[11px] lg:text-[12px] font-medium uppercase tracking-[0.16em] text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.24),transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
                <span className="relative z-10 truncate">{isHome ? (direction === "rtl" ? "ابدأ التشخيص" : "Start Assessment") : mainNav.diagnostic || "Start Assessment"}</span>
                <ArrowUpRight className="relative z-10 h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:rotate-180" aria-hidden />
              </Link>
            </motion.div>
          )}

          {/* Mobile CTA icon */}
          {!isSubscription && (
            <Link href="/diagnostic" className="sm:hidden flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[hsl(187,27%,40%)] to-[hsl(45,93%,47%)] text-white shadow-md focus-visible:outline-2 focus-visible:outline-primary" aria-label={mainNav.diagnostic || "Start Assessment"}>
              <ArrowUpRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
          )}

          {/* Mobile Menu trigger */}
          {isHome && (
            <motion.button
              whileHover={getButtonHover(0, 1.04)}
              whileTap={buttonTap}
              aria-label={dictionary.homeLanding.nav.menu}
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[hsl(187,27%,40%)]/20 bg-white text-[hsl(187,27%,40%)] hover:bg-[hsl(187,27%,40%)]/5 lg:hidden focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Menu className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.header>
  );
}
