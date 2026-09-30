"use client";

import { LayoutGroup, motion } from "framer-motion";
import { useId } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANGS, type Lang } from "@/lib/i18n/config";
import { SPRING_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
  /** `sm` for headers and shells, `md` for menus where it is a primary control. */
  size?: "sm" | "md";
  /** Called after the language changes (e.g. the diagnostic restarts its session). */
  onChange?: (language: Lang) => void;
};

/**
 * The one language control used across MindWeave. The active indicator slides between options;
 * each instance scopes its own layout group so two switchers on a page never animate into each other.
 */
export function LanguageSwitcher({ className, size = "sm", onChange }: LanguageSwitcherProps) {
  const { language, setLanguage, dictionary } = useLanguage();
  const scope = useId();

  return (
    <LayoutGroup id={scope}>
      <div
        role="group"
        aria-label={`${dictionary.nav.language} / Language`}
        className={cn("inline-flex shrink-0 items-center gap-0.5 rounded-full border border-line bg-white/80 p-1 backdrop-blur-sm", className)}
      >
        {LANGS.map((item) => {
          const active = item.code === language;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                if (active) return;
                setLanguage(item.code);
                onChange?.(item.code);
              }}
              aria-pressed={active}
              aria-label={item.label}
              title={item.label}
              lang={item.bcp47}
              className={cn(
                // The ::before extends the hit area to a comfortable touch target without enlarging the control.
                "relative inline-flex cursor-pointer items-center justify-center rounded-full font-semibold tracking-wide transition-colors duration-200 before:absolute before:-inset-1.5 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500",
                size === "sm" ? "h-8 min-w-10 px-2.5 text-xs" : "h-10 min-w-14 px-4 text-sm",
                active ? "text-white" : "text-ink-muted hover:text-ink",
              )}
            >
              {active ? (
                <motion.span layoutId="language-indicator" className="absolute inset-0 rounded-full bg-primary" transition={SPRING_SOFT} aria-hidden />
              ) : null}
              <span className="relative z-10">{item.flag}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
