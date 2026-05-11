"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "$9.99",
    period: "/month",
    desc: "Essential tools for personal wellness.",
    features: [
      "3 diagnostic sessions/month",
      "Journal with text entries",
      "Session history & insights",
      "Email support",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19.99",
    period: "/month",
    desc: "Advanced therapeutic experience.",
    features: [
      "Unlimited diagnostic sessions",
      "Journal with voice & text",
      "Mira voice conversations",
      "Pattern analysis & reports",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "parents",
    name: "Parents",
    price: "$29.99",
    period: "/month",
    desc: "For parents & family wellness.",
    features: [
      "All Pro features",
      "Up to 4 family profiles",
      "Family insights dashboard",
      "Shared journal option",
      "24/7 dedicated support",
    ],
    popular: false,
  },
];

export default function SubscriptionPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[-10rem] top-[6rem] h-[34rem] w-[34rem] rounded-full bg-[#dceccb]/60 blur-[120px]" />
        <div className="absolute right-[-8rem] top-[18rem] h-[30rem] w-[30rem] rounded-full bg-[#dfe8f5]/75 blur-[130px]" />
        <div className="absolute left-[20%] top-[45%] h-[26rem] w-[26rem] rounded-full bg-white/60 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(183,216,156,0.15),transparent_25%),radial-gradient(circle_at_80%_15%,rgba(223,232,245,0.6),transparent_20%),linear-gradient(180deg,#fafaf8_0%,#f6f5ef_48%,#fafaf8_100%)]" />
        <div className="grain-overlay absolute inset-0 opacity-[0.06]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[98rem] px-6 pb-16 pt-6 sm:px-10 lg:px-16">
        <header className="flex flex-col gap-4 border-b border-black/8 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black text-[#fafaf8]"
            >
              <Brain className="h-5 w-5" />
            </motion.div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-black/85">
                VitaMind
              </div>
              <div className="text-sm text-black/45">Choose your plan</div>
            </div>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <LanguageSwitcher />
            <Link
              href="/auth/signin"
              className="inline-flex h-9 items-center justify-center rounded-full border border-black/8 bg-white/74 px-4 text-xs text-black/65"
            >
              Sign in
            </Link>
          </div>
        </header>

        <div className="mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-dark shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Subscription
            </div>
            <h1 className="mt-8 text-[clamp(2.5rem,7vw,5rem)] font-semibold leading-[0.9] tracking-[-0.06em]">
              Choose your path
              <span className="block text-black/50">to wellness.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-black/55">
              Select the plan that fits your journey. All plans include a 7-day free trial.
            </p>
          </motion.div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3 md:max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`card-cinema relative flex flex-col p-7 sm:p-8 ${
                plan.popular ? "border-primary/40 ring-1 ring-primary/30 scale-[1.02]" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute right-5 top-5 rounded-full bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
                  Popular
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-black">{plan.name}</h3>
                <p className="mt-1.5 text-sm text-black/45">{plan.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-black">{plan.price}</span>
                  <span className="text-sm text-black/40">{plan.period}</span>
                </div>
              </div>
              <ul className="mt-8 flex-1 space-y-3.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-black/60">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href={`/subscription/payment?plan=${plan.id}`}
                  className={`flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                    plan.popular
                      ? "bg-black text-white shadow-md"
                      : "border border-black/10 bg-white/80 text-black/70"
                  }`}
                >
                  Choose {plan.name}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 mx-auto flex max-w-2xl items-center justify-center gap-3 rounded-[28px] border border-black/8 bg-white/70 px-5 py-4 text-sm text-black/45"
        >
          <ShieldCheck className="h-4 w-4 shrink-0 text-primary-dark" />
          Secure payment · Cancel anytime · 7-day free trial on all plans
        </motion.div>

        <section className="relative mt-24 overflow-hidden rounded-[2.8rem] border border-black/8 bg-black px-8 py-14 text-[#fafaf8] shadow-[0_30px_120px_rgba(17,17,17,0.16)] sm:px-10 lg:px-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(183,216,156,0.2),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(223,232,245,0.14),transparent_30%)]" />
          <div className="relative">
            <h2 className="max-w-4xl text-4xl font-semibold leading-[0.88] tracking-[-0.085em] text-white sm:text-5xl lg:text-[4.5rem]">
              Start your free trial.
              <span className="block text-white/55">No commitment. Cancel anytime.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/66">
              Every plan includes 7 days free. Experience the full cinematic therapeutic journey with no risk.
            </p>
            <div className="relative mt-8 flex flex-col gap-3 border-t border-white/10 pt-7 sm:flex-row sm:flex-wrap">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#fafaf8] px-7 py-3.5 text-sm font-semibold text-black transition-all hover:-translate-y-0.5"
              >
                Continue to dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 px-5 py-3.5 text-sm text-white/55">
                <ShieldCheck className="h-4 w-4" />
                Secure & private
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
