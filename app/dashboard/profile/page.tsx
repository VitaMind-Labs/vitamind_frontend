"use client";

import { motion } from "framer-motion";
import { UserRound } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-black/40">
          <UserRound className="h-3.5 w-3.5" />
          Profile
        </div>
        <h1 className="mt-4 text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[0.92] tracking-[-0.05em]">
          Profile settings.
        </h1>
      </motion.div>

      <div className="mt-8 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="card-cinema p-6 sm:p-8"
        >
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-xl font-semibold text-white">
              U
            </div>
            <div>
              <h2 className="text-xl font-semibold text-black">Username</h2>
              <p className="mt-1 text-sm text-black/45">Member since May 2026</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="card-cinema p-6 sm:p-8"
        >
          <h3 className="text-sm font-semibold text-black/70">Personal information</h3>
          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-black/40">Nickname</label>
              <input
                defaultValue="Username"
                className="w-full rounded-2xl border border-black/8 bg-[#fdfdfc] px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/6"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-black/40">Email</label>
              <input
                defaultValue="user@example.com"
                className="w-full rounded-2xl border border-black/8 bg-[#fdfdfc] px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/6"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-black/40">Language preference</label>
              <select className="w-full rounded-2xl border border-black/8 bg-[#fdfdfc] px-4 py-3 text-sm outline-none transition focus:border-black/20">
                <option>English</option>
                <option>Français</option>
                <option>العربية</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3 border-t border-black/8 pt-5">
            <button className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5">
              Save changes
            </button>
            <button className="rounded-full border border-black/8 bg-white/80 px-6 py-2.5 text-sm font-medium text-black/50 transition hover:border-black/20">
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
