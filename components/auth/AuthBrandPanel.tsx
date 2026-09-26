"use client";

import { BrandLogo } from "@/components/shared/BrandLogo";
import { useLanguage } from "@/contexts/LanguageContext";
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";

export function AuthBrandPanel() {
  const { dictionary } = useLanguage();
  const hero = dictionary.homeLanding.hero;
  const auth = dictionary.auth;
  const reduce = useReducedMotion();

  return (
    <motion.aside
      aria-hidden
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: EASE_OUT }}
      className="relative isolate hidden h-full flex-col overflow-hidden rounded-[2rem] bg-[linear-gradient(155deg,var(--color-teal-500),var(--color-teal-800)_60%,var(--color-ink))] p-8 text-white lg:flex xl:p-10"
    >
      {/* ── 1. Radial sombre principal — dérive organique lente ──────── */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -z-10 h-[44rem] w-[44rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(6,20,15,0.9) 0%, rgba(6,20,15,0.5) 38%, transparent 72%)",
        }}
        initial={{ x: "-30%", y: "-20%", scale: 1 }}
        animate={
          reduce
            ? undefined
            : {
                x: ["-30%", "35%", "5%", "-30%"],
                y: ["-20%", "25%", "60%", "-20%"],
                scale: [1, 1.15, 0.95, 1],
              }
        }
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.35, 0.7, 1],
        }}
      />

      {/* ── 2. Halo doré — orbite autour du coin haut-droit ──────────── */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -z-10 h-[26rem] w-[26rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(227,176,28,0.45) 0%, rgba(227,176,28,0.15) 45%, transparent 72%)",
        }}
        initial={{ top: "10%", left: "-15%" }}
        animate={
          reduce
            ? undefined
            : {
                top: ["10%", "55%", "20%", "10%"],
                left: ["-15%", "15%", "-5%", "-15%"],
                opacity: [0.9, 0.55, 0.85, 0.9],
              }
        }
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.4, 0.75, 1],
        }}
      />

      {/* ── 3. Halo sage — pulsation douce en bas à droite ───────────── */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 end-[-10%] -z-10 h-80 w-80 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(168,191,160,0.35) 0%, transparent 70%)",
        }}
        animate={reduce ? undefined : { scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── 4. Petites particules lumineuses qui montent ────────────── */}
      {!reduce && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          {Array.from({ length: 14 }).map((_, i) => {
            const left = (i * 37) % 100;
            const delay = (i * 0.7) % 6;
            const duration = 9 + (i % 5);
            const size = 2 + (i % 3);
            return (
              <motion.span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${left}%`,
                  width: size,
                  height: size,
                  filter: "blur(0.5px)",
                }}
                initial={{ bottom: "-5%", opacity: 0 }}
                animate={{
                  bottom: ["-5%", "105%"],
                  opacity: [0, 0.6, 0.6, 0],
                  x: [0, i % 2 === 0 ? 18 : -18, 0],
                }}
                transition={{
                  duration,
                  delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
      )}

      {/* ── 5. Grain subtil animé (texture) ─────────────────────────── */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] mix-blend-soft-light"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
          animate={{ backgroundPosition: ["0px 0px", "22px 22px"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* ── 6. Liseré lumineux qui balaye (top border shimmer) ──────── */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(227,176,28,0.9),rgba(168,191,160,0.9),transparent)]"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
        />
      )}

      {/* ── Contenu ─────────────────────────────────────────────────── */}
      <motion.div
        variants={stagger(0.09, 0.15)}
        initial="hidden"
        animate="show"
        className="relative flex h-full flex-1 flex-col"
      >
        {/* Logo — entrée avec léger overshoot */}
        <motion.div
          variants={fadeUp()}
          className="flex items-start"
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
          >
            <BrandLogo size="lg" />
          </motion.div>
        </motion.div>

        {/* Tagline en bas */}
        <div className="mt-auto max-w-sm pt-10">
          <motion.p
            variants={fadeUp()}
            className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-100/80"
          >
            {auth.badge}
          </motion.p>
          <motion.p
            variants={fadeUp()}
            className="mt-3 text-[clamp(1.375rem,1.6vw+1rem,2rem)] font-medium leading-[1.15] tracking-[-0.02em]"
          >
            {hero.titleA}{" "}
            <motion.span
              className="inline-block bg-[linear-gradient(120deg,var(--color-teal-100),var(--color-gold-300),var(--color-teal-100))] bg-[length:200%_100%] bg-clip-text text-transparent"
              animate={
                reduce
                  ? undefined
                  : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
              }
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              {hero.titleB}
            </motion.span>
          </motion.p>
        </div>
      </motion.div>
    </motion.aside>
  );
}