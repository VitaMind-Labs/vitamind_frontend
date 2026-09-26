"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

type HeaderShellProps = {
  children: ReactNode;
  /** `fixed` floats over hero media; `sticky` reserves its own space; `static` stays in flow. */
  position?: "fixed" | "sticky" | "static";
  /** `bar` renders the floating pill surface; `bare` keeps the same metrics with no surface. */
  surface?: "bar" | "bare";
  className?: string;
  innerClassName?: string;
};

/**
 * The one visual container every VitaMind header is built from.
 * Variants (public / auth / checkout / app) only change what goes inside.
 */
export function HeaderShell({
  children,
  position = "sticky",
  surface = "bar",
  className,
  innerClassName,
}: HeaderShellProps) {
  const { direction } = useLanguage();
  const scrolled = useScrolled();

  return (
    <motion.header
      dir={direction}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className={cn(
        "z-50 w-full px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4 sm:pt-4",
        position === "fixed" && "fixed inset-x-0 top-0",
        position === "sticky" && "sticky top-0",
        position === "static" && "relative",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-16 w-full max-w-page items-center gap-2 rounded-full px-2.5 sm:gap-3 sm:px-3.5",
          surface === "bar" &&
            "border backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-300 ease-out-soft",
          surface === "bar" &&
            (scrolled
              ? "border-line bg-white/92 shadow-raised"
              : "border-white/80 bg-white/78 shadow-card"),
          innerClassName,
        )}
      >
        {children}
      </div>
    </motion.header>
  );
}
