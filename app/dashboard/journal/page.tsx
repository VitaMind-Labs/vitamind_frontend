"use client";

import { motion } from "framer-motion";
import { BookHeart } from "lucide-react";

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-black/40">
          <BookHeart className="h-3.5 w-3.5" />
          Journal
        </div>
        <h1 className="mt-4 text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[0.92] tracking-[-0.05em]">
          Your private journal.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-black/55">
          A safe space to write freely. Every entry is confidential and stays between you and your therapeutic journey.
        </p>
      </motion.div>

      <div className="mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="card-cinema p-6 sm:p-8"
        >
          <textarea
            placeholder="What's on your mind today? Write without judgment..."
            className="min-h-[280px] w-full resize-none bg-transparent text-base leading-7 text-foreground outline-none placeholder:text-black/25"
          />
          <div className="mt-4 flex items-center justify-between border-t border-black/8 pt-4">
            <span className="text-xs text-black/30">0 words</span>
            <button className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5">
              Save entry
            </button>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="card-cinema p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-black/40">Yesterday</p>
          <p className="mt-2 text-sm leading-6 text-black/60 line-clamp-3">
            Felt more grounded today. The morning breathing exercise helped center my thoughts before the meeting...
          </p>
          <p className="mt-3 text-[11px] text-black/30">12:30 PM · 142 words</p>
        </div>
        <div className="card-cinema p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-black/40">3 days ago</p>
          <p className="mt-2 text-sm leading-6 text-black/60 line-clamp-3">
            Noticed some anxiety creeping back in the evening. Used the grounding technique from the last session...
          </p>
          <p className="mt-3 text-[11px] text-black/30">9:15 PM · 98 words</p>
        </div>
      </div>
    </div>
  );
}
