"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANGS } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full border border-primary/20 bg-white/85 p-1 text-[11px] sm:text-xs font-semibold shadow-[0_8px_24px_rgba(81,133,145,0.12)] backdrop-blur-md"
      role="group"
      aria-label="Language"
    >
      {LANGS.map((item) => {
        const active = item.code === language;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLanguage(item.code)}
            aria-pressed={active}
            aria-label={`${item.label} - ${item.code.toUpperCase()}`}
            title={item.label}
            className="relative rounded-full px-2.5 sm:px-3 py-1.5 min-h-[28px] sm:min-h-[30px] min-w-[38px] sm:min-w-[44px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {active ? (
              <motion.span
                layoutId="language-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-[#3d6a73] shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            ) : null}
            <span className={`relative z-10 flex items-center justify-center gap-1 ${active ? "text-white font-bold" : "text-[#2c3e3b]/65 font-semibold hover:text-[#2c3e3b]"}`}>
              <span className="text-[11px] sm:text-xs tracking-wide">{item.flag}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
