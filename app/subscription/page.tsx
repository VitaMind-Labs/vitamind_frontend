"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, CheckCircle2, ShieldCheck, Sparkles, CreditCard, Calendar, Users, Crown } from "lucide-react";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "19,99TND",
    period: "/month",
    desc: "The essentials to begin your wellness journey.",
    features: [
      "3 diagnostic sessions / month",
      "Text journal",
      "History & insights",
      "Email support",
    ],
    icon: Brain,
    popular: false,
    color: "from-[#518591]/20 to-[#518591]/5",
    borderColor: "border-[#518591]/20",
  },
  {
    id: "pro",
    name: "Pro",
    price: "39,99TND",
    period: "/month",
    desc: "The full therapeutic experience.",
    features: [
      "Unlimited diagnostic sessions",
      "Voice & text journal",
      "Voice conversations with Mira",
      "Behavioral analytics",
      "Priority support",
    ],
    icon: Crown,
    popular: true,
    color: "from-[#e3b01c]/20 to-[#518591]/10",
    borderColor: "border-[#e3b01c]/30",
  },
  {
    id: "parents",
    name: "Family",
    price: "69,99TND",
    period: "/month",
    desc: "For the whole family, with peace of mind.",
    features: [
      "All Pro features",
      "Up to 4 family profiles",
      "Family dashboard",
      "Shared journal",
      "Dedicated 24/7 support",
    ],
    icon: Users,
    popular: false,
    color: "from-[#518591]/20 to-[#e3b01c]/10",
    borderColor: "border-[#518591]/20",
  },
];

export default function SubscriptionPage() {
  return (
    <div className="relative min-h-screen bg-[#F0F0F0] text-[#2c3e3b]">
      {/* Background with animated orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute left-[-10rem] top-[6rem] h-[34rem] w-[34rem] rounded-full bg-[#518591]/20 blur-[120px]"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute right-[-8rem] top-[18rem] h-[30rem] w-[30rem] rounded-full bg-[#e3b01c]/15 blur-[130px]"
        />
        <div className="absolute left-[20%] top-[45%] h-[26rem] w-[26rem] rounded-full bg-white/40 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(81,133,145,0.08),transparent_40%),radial-gradient(circle_at_80%_15%,rgba(227,176,28,0.06),transparent_30%)]" />
        <div className="grain-overlay absolute inset-0 opacity-[0.03]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[98rem] px-6 pb-20 pt-5 sm:px-10 lg:px-16">

        {/* Section Hero */}
        <div className="mt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#518591]/20 bg-white/60 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#e3b01c]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#518591]">
                Subscription
              </span>
            </div>
            <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
              <span className="bg-gradient-to-r from-[#518591] via-[#3d6a73] to-[#e3b01c] bg-clip-text text-transparent">
                Choose your path
              </span>
              <span className="block text-[#2c3e3b]/50 mt-2">to wellness.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-[#2c3e3b]/60">
              Select the plan that matches your journey.
              All subscriptions include a 7-day free trial.
            </p>
          </motion.div>
        </div>

        {/* Plans grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-3 md:max-w-6xl mx-auto">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                className={`relative rounded-2xl bg-white/80 backdrop-blur-sm p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border ${plan.borderColor
                  } ${plan.popular ? "ring-2 ring-[#e3b01c]/40 shadow-xl" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#e3b01c] to-[#c49b0f] px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                    Popular
                  </div>
                )}

                {/* Plan header */}
                <div className="text-center">
                  <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${plan.color}`}>
                    <Icon className="h-7 w-7 text-[#518591]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#2c3e3b]">{plan.name}</h3>
                  <p className="mt-1 text-sm text-[#2c3e3b]/50">{plan.desc}</p>
                  <div className="mt-6 flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-[#2c3e3b]">{plan.price}</span>
                    <span className="text-sm text-[#2c3e3b]/40">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="mt-8 space-y-3 border-t border-[#518591]/10 pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-[#2c3e3b]/70">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#e3b01c]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA button */}
                <div className="mt-8">
                  <Link
                    href={`/subscription/payment?plan=${plan.id}`}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-300 ${plan.popular
                      ? "bg-gradient-to-r from-[#518591] to-[#3d6a73] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                      : "border border-[#518591]/20 bg-white text-[#2c3e3b]/70 hover:border-[#518591] hover:bg-[#518591]/5 hover:text-[#518591]"
                      }`}
                  >
                    Choose {plan.name}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Security badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-[#518591]/10 px-6 py-4 text-sm text-[#2c3e3b]/60"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#e3b01c]" />
            <span>Secure payment</span>
          </div>
          <div className="w-px h-4 bg-[#518591]/20 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#e3b01c]" />
            <span>Flexible cancellation</span>
          </div>
          <div className="w-px h-4 bg-[#518591]/20 hidden sm:block" />
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-[#e3b01c]" />
            <span>7-day free trial</span>
          </div>
        </motion.div>


        {/* FAQ section - Added for credibility */}
        <div className="mt-20 text-center">
          <h3 className="text-lg font-semibold text-[#2c3e3b]">Frequently asked questions?</h3>
          <p className="mt-2 text-sm text-[#2c3e3b]/50">
            Have a question? Visit our{" "}
            <Link href="/faq" className="text-[#518591] hover:underline">
              help center
            </Link>{" "}
            or contact our team.
          </p>
        </div>
      </div>

      <style jsx>{`
        .grain-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 200px;
          opacity: 0.4;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}