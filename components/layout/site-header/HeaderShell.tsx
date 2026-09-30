"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The one header height used by every header in the app (public, checkout, auth,
 * orientation and the patient top bar), so switching pages never shifts the chrome.
 */
export const HEADER_HEIGHT = "h-16 lg:h-[4.5rem]";

export function useScrolled(threshold = 12) {
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
  /**
   * `edge` — full-width, part of the page at the top; a hairline surface fades in on scroll (marketing, checkout).
   * `bar`  — floating pill surface (application chrome).
   * `bare` — same metrics, no surface.
   */
  surface?: "edge" | "bar" | "bare";
  /** Force the scrolled surface (e.g. while a menu is open). */
  solid?: boolean;
  className?: string;
  innerClassName?: string;
};

/**
 * The one container every MindWeave header is built from.
 * Variants only change what goes inside and which surface it wears.
 */
export function HeaderShell({ children, position = "sticky", surface = "edge", solid = false, className, innerClassName }: HeaderShellProps) {
  const { direction } = useLanguage();
  const scrolled = useScrolled();
  const raised = scrolled || solid;

  if (surface === "edge") {
    return (
      <motion.header
        dir={direction}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className={cn(
          "z-50 w-full pt-[env(safe-area-inset-top)]",
          position === "fixed" && "fixed inset-x-0 top-0",
          position === "sticky" && "sticky top-0",
          position === "static" && "relative",
          className,
        )}
      >
        {/* Surface fades in (opacity only) — no background snapping, no layout shift below. */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 border-b bg-white/88 backdrop-blur-xl transition-[opacity,border-color] duration-300 ease-out-soft",
            raised ? "border-line opacity-100" : "border-transparent opacity-0",
          )}
        />
        <div
          className={cn(
            "page-container relative flex items-center gap-3",
            HEADER_HEIGHT,
            innerClassName,
          )}
        >
          {children}
        </div>
      </motion.header>
    );
  }

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
          HEADER_HEIGHT,
          "mx-auto flex w-full max-w-page items-center gap-2 rounded-full px-2.5 sm:gap-3 sm:px-3.5",
          surface === "bar" && "border backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-300 ease-out-soft",
          surface === "bar" && (raised ? "border-line bg-white/92 shadow-raised" : "border-white/80 bg-white/78 shadow-card"),
          innerClassName,
        )}
      >
        {children}
      </div>
    </motion.header>
  );
}
