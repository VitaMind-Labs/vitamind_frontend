"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Brain, HeartHandshake } from "lucide-react";
import {
  ambientFloat,
  ambientFloatTransition,
  buttonTap,
  getButtonHover,
  getRevealProps,
  shimmerSweep,
  shimmerSweepTransition,
} from "../animations";

export default function PlatformOverview() {
  return (
    <section className="relative overflow-hidden py-6">
      <motion.div
        {...getRevealProps({ y: 28, blur: 10, duration: 1 })}
        className="relative overflow-hidden rounded-[32px] border border-[rgba(81,133,145,0.18)] px-8 py-12 md:px-12 md:py-16"
        style={{
          background:
            "linear-gradient(145deg, rgba(16,28,31,0.96) 0%, rgba(26,44,47,0.94) 60%, rgba(61,52,20,0.92) 100%)",
          boxShadow: "0 24px 80px -28px rgba(15,23,42,0.38)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={ambientFloat}
            transition={{ ...ambientFloatTransition, duration: 18 }}
            className="absolute -left-16 top-0 h-72 w-72 rounded-full blur-[120px]"
            style={{ background: "rgba(81,133,145,0.22)" }}
          />
          <motion.div
            animate={ambientFloat}
            transition={{ ...ambientFloatTransition, duration: 15, delay: 0.6 }}
            className="absolute bottom-[-20%] right-[-5%] h-80 w-80 rounded-full blur-[120px]"
            style={{ background: "rgba(227,176,28,0.16)" }}
          />
          <motion.div
            animate={shimmerSweep}
            transition={{ ...shimmerSweepTransition, duration: 5 }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />
        </div>

        <div className="relative z-10 flex flex-col gap-12">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <motion.div
                {...getRevealProps({ delay: 0.08, y: 14, blur: 6, duration: 0.75 })}
                className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/8 px-5 py-2.5 backdrop-blur-md"
              >
                <Brain className="h-4 w-4 text-[hsl(45,93%,47%)]" />
                <span className="font-body text-[11px] font-semibold uppercase tracking-[0.28em] text-white/85">
                  VitaMind Platform
                </span>
              </motion.div>

              <motion.h2
                {...getRevealProps({ delay: 0.14, y: 22, blur: 10, duration: 0.95 })}
                className="mt-7 max-w-4xl font-display text-[clamp(34px,5vw,68px)] font-light leading-[1.02] tracking-[-0.035em] text-white"
              >
                Building the future of
                <span className="bg-gradient-to-r from-[hsl(45,93%,47%)] via-white to-[hsl(187,27%,40%)] bg-clip-text text-transparent">
                  {" "}accessible mental healthcare.
                </span>
              </motion.h2>

              <motion.p
                {...getRevealProps({ delay: 0.2, y: 18, blur: 8, duration: 0.85 })}
                className="mt-6 max-w-3xl font-body text-[17px] leading-[1.8] text-white/72"
              >
                VitaMind bridges the gap between emotional distress and the first psychiatric consultation
                with structured triage, culturally aware AI, and a calmer path to care.
              </motion.p>
            </div>

            <motion.div whileHover={getButtonHover()} whileTap={buttonTap}>
              <Link
                href="/diagnostic"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/15 bg-gradient-to-r from-[hsl(45,93%,47%)] to-[hsl(187,27%,40%)] px-7 py-4 font-body text-[12px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_18px_44px_rgba(81,133,145,0.24)]"
              >
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <HeartHandshake className="relative z-10 h-4 w-4" />
                <span className="relative z-10">Explore VitaMind</span>
                <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.16 } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 gap-4 border-t border-white/10 pt-8 md:grid-cols-3"
          >
            {[
              { value: "AI + CBT", label: "Therapeutic intelligence" },
              { value: "3 Languages", label: "Arabic, French, English" },
              { value: "24/7", label: "Structured support access" },
            ].map((item) => (
              <motion.div
                key={item.value}
                variants={{
                  hidden: { opacity: 0, y: 24, scale: 0.98, filter: "blur(8px)" },
                  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
                }}
                className="rounded-[22px] border border-white/10 bg-white/7 px-5 py-5 backdrop-blur-md"
              >
                <p className="font-display text-[28px] font-light tracking-[-0.03em] text-[hsl(45,93%,47%)]">
                  {item.value}
                </p>
                <p className="mt-2 font-body text-[14px] leading-relaxed text-white/68">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}