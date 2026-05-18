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
  const { dictionary } = useLanguage();
  const nav = isHome ? null : dictionary.nav;
  const { scrollY } = useScroll();
  const headerScale = useTransform(scrollY, [0, 180], [1, 0.985]);
  const headerY = useTransform(scrollY, [0, 180], [0, -4]);
  const headerShadow = useTransform(
    scrollY,
    [0, 180],
    [
      "0 12px 32px rgba(15,23,42,0.06)",
      "0 24px 56px rgba(15,23,42,0.14)",
    ]
  );
  const headerBackground = useTransform(
    scrollY,
    [0, 180],
    ["rgba(255,255,255,0.68)", "rgba(255,255,255,0.86)"]
  );

  return (
    <motion.header
      {...getRevealProps({ y: -18, blur: 12, duration: 1.05 })}
      className="fixed left-1/2 top-5 z-50 w-full -translate-x-1/2 px-4"
    >
      <motion.div
        style={{
          scale: headerScale,
          y: headerY,
          boxShadow: headerShadow,
          backgroundColor: headerBackground,
        }}
        className="mx-auto flex h-[76px] w-full max-w-[1380px] items-center justify-between rounded-full border border-white/25 px-4 backdrop-blur-2xl md:px-7"
      >
        {/* LEFT - Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-all duration-300"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white p-2 shadow-sm">
            <Image
              src="/logo.png"
              alt="VitaMind Logo"
              width={42}
              height={42}
              className="h-8 w-8 object-contain md:h-9 md:w-9"
              priority
            />
          </div>
        </Link>

        {/* CENTER NAV */}
        {isHome && (
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group relative rounded-full px-5 py-2 text-[13px] font-medium text-[hsl(222,47%,11%)]/70 transition-all duration-300 hover:bg-[hsl(45,93%,47%)]/10 hover:text-[hsl(187,27%,40%)]"
              >
                {item.label}
                <span className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-[hsl(45,93%,47%)] to-[hsl(187,27%,40%)] transition-all duration-300 group-hover:w-6" />
              </Link>
            ))}
          </nav>
        )}

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* Language Switcher - auth/diagnostic pages only */}
          {showControls && <LanguageSwitcher />}

          {/* Login */}
          {!isSubscription && (
            <motion.div whileHover={getButtonHover(0, 1.01)} whileTap={buttonTap}>
              <Link
                href="/auth/signin"
                className="hidden rounded-full border border-[hsl(187,27%,40%)]/20 bg-white px-5 py-2 text-[13px] font-medium text-[hsl(187,27%,40%)] transition-all duration-300 hover:border-[hsl(187,27%,40%)]/40 hover:bg-[hsl(187,27%,40%)]/5 md:flex"
              >
                {isHome ? "Login" : (nav?.signIn || "Login")}
              </Link>
            </motion.div>
          )}

          {/* CTA Button */}
          {!isSubscription && (
            <motion.div
              whileHover={getButtonHover()}
              whileTap={buttonTap}
            >
              <Link
                href="/diagnostic"
                className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[hsl(187,27%,40%)] to-[hsl(45,93%,47%)] px-6 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
              >
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.24),transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative z-10">
                  {isHome ? "Start Assessment" : (nav?.diagnostic || "Start Assessment")}
                </span>
                <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          )}

          {/* Mobile Menu */}
          {isHome && (
            <motion.button
              whileHover={getButtonHover(0, 1.04)}
              whileTap={buttonTap}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[hsl(187,27%,40%)]/20 bg-white text-[hsl(187,27%,40%)] transition-all duration-300 hover:bg-[hsl(187,27%,40%)]/5 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.header>
  );
}
