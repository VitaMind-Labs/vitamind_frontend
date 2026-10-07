"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The one header height used by every header in the app (public, auth,
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

/**
 * Smart header: tucks away while the reader scrolls down, returns the moment they scroll up.
 * Always visible near the top, whenever `locked` (a menu is open) and while keyboard focus is inside it.
 */
function useHeaderHidden(enabled: boolean, locked: boolean) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - last;
        if (y < 160) setHidden(false);
        else if (delta > 10) setHidden(true);
        else if (delta < -10) setHidden(false);
        // Only move the reference once a real direction change was read, so slow drags still register.
        if (Math.abs(delta) > 10 || y < 160) last = y;
        frame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return enabled && hidden && !locked;
}

type HeaderShellProps = {
  children: ReactNode;
  /** `fixed` floats over hero media; `sticky` reserves its own space; `static` stays in flow. */
  position?: "fixed" | "sticky" | "static";
  /**
   * `edge` — full-width, part of the page at the top; a hairline surface fades in on scroll (marketing).
   * `bar`  — floating pill surface (application chrome).
   * `capsule` — marketing: wide and open at the top, condenses into a floating glass capsule on scroll,
   *            tucks away while reading down and returns on the way up.
   * `bare` — same metrics, no surface.
   */
  surface?: "edge" | "bar" | "bare" | "capsule";
  /** Force the scrolled surface (e.g. while a menu is open). */
  solid?: boolean;
  className?: string;
  innerClassName?: string;
};

/**
 * The one container every SynQ header is built from.
 * Variants only change what goes inside and which surface it wears.
 */
export function HeaderShell({ children, position = "sticky", surface = "edge", solid = false, className, innerClassName }: HeaderShellProps) {
  const { direction } = useLanguage();
  const scrolled = useScrolled();
  const raised = scrolled || solid;
  const reduce = useReducedMotion();
  const [focusInside, setFocusInside] = useState(false);
  const hidden = useHeaderHidden(surface === "capsule", solid || focusInside);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 28, restDelta: 0.001 });

  if (surface === "capsule") {
    return (
      <motion.header
        dir={direction}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: "-30%" }}
        animate={reduce ? { opacity: 1 } : { opacity: hidden ? 0 : 1, y: hidden ? "-130%" : "0%" }}
        transition={{ duration: hidden ? 0.35 : 0.5, ease: EASE_OUT }}
        onFocusCapture={() => setFocusInside(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusInside(false);
        }}
        className={cn(
          "pointer-events-none z-50 w-full px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5 sm:pt-4",
          position === "fixed" && "fixed inset-x-0 top-0",
          position === "sticky" && "sticky top-0",
          position === "static" && "relative",
          className,
        )}
      >
        <div
          className={cn(
            HEADER_HEIGHT,
            "pointer-events-auto relative mx-auto flex w-full items-center gap-2 rounded-full border px-3 transition-[max-width,background-color,border-color,box-shadow] duration-500 ease-out-soft motion-reduce:transition-none sm:gap-3 sm:px-4",
            raised ? "max-w-[min(74rem,100%)] border-white/70 bg-white/80 shadow-float ring-1 ring-line/50 backdrop-blur-xl" : "max-w-page border-transparent bg-transparent",
            innerClassName,
          )}
        >
          {children}
          {/* Reading progress, drawn along the capsule's lower edge once it has condensed */}
          <span
            aria-hidden
            className={cn("pointer-events-none absolute inset-x-8 -bottom-px h-px overflow-hidden transition-opacity duration-500", raised ? "opacity-100" : "opacity-0")}
          >
            <motion.span style={{ scaleX: reduce ? scrollYProgress : progress }} className="block h-full origin-left bg-[linear-gradient(90deg,var(--color-teal-500),var(--color-gold))] rtl:origin-right" />
          </span>
        </div>
      </motion.header>
    );
  }

  if (surface === "edge") {
    return (
      <motion.header
        dir={direction}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
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
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
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
