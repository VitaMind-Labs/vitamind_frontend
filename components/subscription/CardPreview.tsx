"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Leaf, Nfc } from "lucide-react";
import type { PointerEvent } from "react";

type CardPreviewProps = {
  number: string;
  name: string;
  expiry: string;
  planName: string;
  holderLabel: string;
  expiryLabel: string;
};

/** Display-only card that mirrors the form as the user types, with a gentle pointer tilt. */
export function CardPreview({ number, name, expiry, planName, holderLabel, expiryLabel }: CardPreviewProps) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), { stiffness: 160, damping: 18 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), { stiffness: 160, damping: 18 });
  const shineX = useTransform(px, [-0.5, 0.5], ["0%", "100%"]);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const digits = number.replace(/\D/g, "").padEnd(16, "•").slice(0, 16);
  const groups = digits.match(/.{1,4}/g) ?? [];

  return (
    <div style={{ perspective: "1200px" }} className="mx-auto w-full max-w-[22rem]" aria-hidden>
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={() => { px.set(0); py.set(0); }}
        initial={{ opacity: 0, rotateX: 18, y: 16 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative isolate aspect-[1.586] overflow-hidden rounded-[1.25rem] bg-[linear-gradient(145deg,var(--color-teal-700),var(--color-ink)_60%,#1d2b29)] p-5 text-white shadow-float sm:p-6"
        dir="ltr"
      >
        <span className="pointer-events-none absolute -top-16 -right-10 -z-10 h-48 w-48 rounded-full bg-teal-400/40 blur-3xl" />
        <span className="pointer-events-none absolute -bottom-20 -left-10 -z-10 h-44 w-44 rounded-full bg-gold/25 blur-3xl" />
        <motion.span
          style={{ left: shineX }}
          className="pointer-events-none absolute inset-y-0 -z-10 w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        <div className="flex h-full flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold tracking-wide">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                <Leaf className="h-3.5 w-3.5 text-gold-300" />
              </span>
              {planName}
            </span>
            <Nfc className="h-5 w-5 text-white/70" />
          </div>

          <span className="h-8 w-11 rounded-md bg-[linear-gradient(135deg,var(--color-gold-300),var(--color-gold-600))] opacity-90" />

          <p className="flex justify-between font-mono text-[1.0625rem] tracking-[0.12em] sm:text-lg">
            {groups.map((group, i) => (
              <span key={i}>{group}</span>
            ))}
          </p>

          <div className="flex items-end justify-between gap-4 text-xs">
            <div className="min-w-0">
              <p className="text-[0.625rem] uppercase tracking-[0.16em] text-white/55">{holderLabel}</p>
              <p className="mt-0.5 truncate text-sm font-medium uppercase tracking-wide">{name || "—"}</p>
            </div>
            <div className="shrink-0 text-end">
              <p className="text-[0.625rem] uppercase tracking-[0.16em] text-white/55">{expiryLabel}</p>
              <p className="mt-0.5 font-mono text-sm">{expiry || "MM/YY"}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
