"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";

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
      "Dedicated support",
    ],
    popular: false,
  },
];

export default function DashboardSubscriptionPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-black/40">
          <Sparkles className="h-3.5 w-3.5" />
          Your Plan
        </div>
        <h1 className="mt-4 text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[0.92] tracking-[-0.05em]">
          Manage subscription.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-black/55">
          You are currently on the <strong className="text-black/80">Free trial</strong>. Choose a plan that fits your needs.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`card-cinema relative flex flex-col p-6 ${
              plan.popular ? "border-primary/40 ring-1 ring-primary/30" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute right-4 top-4 rounded-full bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
                Popular
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-black">{plan.name}</h3>
              <p className="mt-1 text-sm text-black/45">{plan.desc}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-3xl font-semibold text-black">{plan.price}</span>
                <span className="text-sm text-black/40">{plan.period}</span>
              </div>
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-black/60">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link
                href={`/subscription/payment?plan=${plan.id}`}
                className={`flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                  plan.popular
                    ? "bg-black text-white shadow-md"
                    : "border border-black/10 bg-white/80 text-black/70"
                }`}
              >
                {plan.popular ? "Choose Pro" : `Choose ${plan.name}`}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-center gap-3 rounded-[28px] border border-black/8 bg-white/70 px-5 py-4 text-sm text-black/45"
      >
        <ShieldCheck className="h-4 w-4 shrink-0 text-primary-dark" />
        Secure payment. Cancel anytime. All plans include a 7-day free trial.
      </motion.div>
    </div>
  );
}
