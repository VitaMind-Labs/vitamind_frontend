"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";

export default function ConsultationPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-black/40">
          <FileText className="h-3.5 w-3.5" />
          Consultation
        </div>
        <h1 className="mt-4 text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[0.92] tracking-[-0.05em]">
          Guided consultations.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-black/55">
          Start a new diagnostic session or continue an existing conversation with Mira.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <Link
            href="/diagnostic"
            className="card-cinema group flex h-full flex-col p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-black">Start new session</h3>
            <p className="mt-2 text-sm leading-6 text-black/50">
              Begin a fresh diagnostic conversation with Mira. A new session ID will be generated.
            </p>
            <div className="mt-auto pt-4">
              <span className="inline-flex items-center gap-1 text-sm font-medium text-black/40 group-hover:text-black transition-colors">
                Begin <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="card-cinema p-6"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/8 bg-white/70">
            <FileText className="h-5 w-5 text-black/30" />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-black/50">Previous sessions</h3>
          <p className="mt-2 text-sm leading-6 text-black/35">
            Your recent consultations will appear here for quick access.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 rounded-[28px] border border-black/8 bg-white/70 p-5"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-black/40">Last session</p>
        <p className="mt-2 text-sm leading-6 text-black/55">May 10, 2026 · Diagnostic · 3 responses</p>
        <Link
          href="/dashboard/history"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-black/50 hover:text-black transition-colors"
        >
          View history <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>
    </div>
  );
}
