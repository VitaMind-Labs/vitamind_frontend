"use client";

import { motion } from "framer-motion";
import { History, Sparkles } from "lucide-react";

const sessions = [
  { date: "May 10, 2026", type: "Diagnostic", summary: "Mild to moderate anxiety pattern identified.", id: "vm-2f8a" },
  { date: "May 3, 2026", type: "Check-in", summary: "Follow-up conversation. Notable improvement in sleep quality.", id: "vm-3c1b" },
  { date: "Apr 26, 2026", type: "Diagnostic", summary: "Initial assessment. Stress-related cognitive tension detected.", id: "vm-7d4e" },
];

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-black/40">
          <History className="h-3.5 w-3.5" />
          History
        </div>
        <h1 className="mt-4 text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[0.92] tracking-[-0.05em]">
          Session history.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-black/55">
          Review your past diagnostic sessions, check-ins, and therapeutic conversations.
        </p>
      </motion.div>

      <div className="mt-8 space-y-4">
        {sessions.map((session, i) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="card-cinema flex items-start justify-between gap-4 p-5 sm:p-6"
          >
            <div className="flex gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black/6">
                <Sparkles className="h-4 w-4 text-black/40" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-black">{session.type}</span>
                  <span className="rounded-full border border-black/8 bg-white/70 px-2.5 py-0.5 text-[10px] text-black/40">{session.id}</span>
                </div>
                <p className="mt-1.5 text-sm leading-6 text-black/55">{session.summary}</p>
                <p className="mt-2 text-xs text-black/35">{session.date}</p>
              </div>
            </div>
            <button className="shrink-0 rounded-full border border-black/8 bg-white/80 px-4 py-2 text-xs font-medium text-black/50 transition hover:border-black/20">
              View
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
