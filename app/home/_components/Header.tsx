"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";

const navLinks = [
  { label: "Platform", href: "/platform" },
  { label: "Solutions", href: "/solutions" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Clinical Safety", href: "/clinical-safety" },
  { label: "Pricing", href: "/pricing" },
];

export default function Header() {
  return (
    <header className="fixed top-5 left-1/2 z-50 w-full -translate-x-1/2 px-4">
      <div className="mx-auto flex h-[76px] w-full max-w-[1380px] items-center justify-between rounded-full border border-black/5 bg-white/70 px-4 shadow-[0_8px_40px_rgba(0,0,0,0.06)] backdrop-blur-2xl md:px-7">

        {/* LEFT */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-all duration-300"
        >
          <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white p-2 shadow-sm">
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
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative rounded-full px-5 py-2 text-[13px] font-medium text-black/70 transition-all duration-300 hover:bg-black/[0.04] hover:text-black"
            >
              {item.label}

              <span className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-black transition-all duration-300 group-hover:w-6" />
            </Link>
          ))}
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* Login */}
          <Link
            href="/auth/signin"
            className="hidden rounded-full border border-black/10 bg-white px-5 py-2 text-[13px] font-medium text-black transition-all duration-300 hover:border-black/20 hover:bg-black/[0.03] md:flex"
          >
            Login
          </Link>

          {/* CTA */}
          <Link
            href="/diagnostic"
            className="group flex items-center gap-2 rounded-full bg-black px-6 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_14px_40px_rgba(0,0,0,0.28)] active:scale-[0.98]"
          >
            Start Assessment

            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

          {/* Mobile */}
          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-black transition-all duration-300 hover:bg-black/[0.04] lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}