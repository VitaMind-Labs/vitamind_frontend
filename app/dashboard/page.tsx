"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookHeart, CalendarDays, FileText, Sparkles } from "lucide-react";

const quickActions = [
  { href: "/dashboard/journal", label: "Write journal", icon: BookHeart, desc: "Express your thoughts freely" },
  { href: "/dashboard/consultation", label: "New consultation", icon: FileText, desc: "Start a guided session" },
  { href: "/dashboard/history", label: "View history", icon: CalendarDays, desc: "Review your progress" },
];

export default function DashboardWelcome() {
  return (
    <div className="mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-black/40">
          <Sparkles className="h-3.5 w-3.5" />
          Dashboard
        </div>
        <h1 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[0.92] tracking-[-0.05em]">
          Welcome back.
          <span className="block text-black/50 mt-1">Your wellness space.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-black/55">
          This is your private area. Journal, review past sessions, track your emotional patterns,
          and manage your subscription — all in one calm, cinematic interface.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={action.href}
                className="card-cinema group flex h-full flex-col p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-black">{action.label}</h3>
                <p className="mt-2 text-sm leading-6 text-black/50">{action.desc}</p>
                <div className="mt-auto pt-4">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-black/40 group-hover:text-black transition-colors">
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-12 card-cinema p-6 sm:p-8"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/6">
            <CalendarDays className="h-5 w-5 text-black/40" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-black/40">Today</p>
            <p className="text-sm font-medium text-black/70">No journal entry yet today</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-black/45">
          Taking a moment to write can bring clarity. Your journal is private and secure.
        </p>
        <Link
          href="/dashboard/journal"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
        >
          Write now
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-6 flex items-center justify-between rounded-[28px] border border-black/8 bg-white/70 px-6 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
            <Sparkles className="h-5 w-5 text-primary-dark" />
          </div>
          <div>
            <p className="text-sm font-medium text-black/70">Your plan</p>
            <p className="text-xs text-black/40">Free trial · 7 days remaining</p>
          </div>
        </div>
        <Link
          href="/dashboard/subscription"
          className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs font-medium text-black/60 transition hover:border-black/20"
        >
          Upgrade
        </Link>
      </motion.div>
    </div>
  );
}
