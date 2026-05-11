"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANGS } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/45 bg-white/70 p-1 text-xs font-semibold shadow-[0_12px_30px_rgba(16,40,35,0.08)] backdrop-blur-md">
      {LANGS.map((item) => {
        const active = item.code === language;

        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLanguage(item.code)}
            className="relative rounded-full px-3 py-1.5 transition-colors"
            aria-label={item.label}
          >
            {active ? (
              <motion.span
                layoutId="language-pill"
                className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,var(--primary),#128763)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            ) : null}
            <span
              className={`relative z-10 ${active ? "text-white" : "text-muted-foreground"}`}
            >
              {item.flag}
            </span>
          </button>
        );
      })}
    </div>
  );
}
