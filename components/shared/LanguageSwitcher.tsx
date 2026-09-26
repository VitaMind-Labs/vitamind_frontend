"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANGS, type Lang } from "@/lib/i18n/config";
import { SPRING_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
  /** Called after the language changes (e.g. the diagnostic restarts its session). */
  onChange?: (language: Lang) => void;
};

export function LanguageSwitcher({ className, onChange }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 rounded-full border border-line bg-white/90 p-1 shadow-xs",
        className,
      )}
      role="group"
      aria-label="Language / اللغة"
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
              "relative inline-flex h-8 min-w-10 cursor-pointer items-center justify-center rounded-full px-2.5 text-xs font-semibold tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-500",
              active ? "text-white" : "text-ink-muted hover:text-ink",
            )}
          >
            {active ? (
              <motion.span
                layoutId="language-pill"
                className="absolute inset-0 rounded-full bg-primary shadow-xs"
                transition={SPRING_SOFT}
                aria-hidden
              />
            ) : null}
            <span className="relative z-10">{item.flag}</span>
          </button>
        );
      })}
    </div>
  );
}
