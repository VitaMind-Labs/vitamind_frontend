"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, CheckCircle2, ShieldCheck, Sparkles, CreditCard, Calendar, Users, Crown } from "lucide-react";
import Header from "./_components/Header";

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
    borderColor: "border-[#518591]/15",
    hoverBorderColor: "hover:border-[#518591]/30",
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
    borderColor: "border-[#e3b01c]/25",
    hoverBorderColor: "hover:border-[#e3b01c]/40",
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
    borderColor: "border-[#518591]/15",
    hoverBorderColor: "hover:border-[#518591]/30",
  },
];

export default function SubscriptionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
     
      <Header  />
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="relative mx-auto  px-6 pb-24 pt-12 sm:px-8 lg:px-12">
          {/* Background orbs */}
          <div className="pointer-events-none max-w-7xl absolute inset-0 overflow-hidden">
            <div className="absolute left-[-5%] top-[-5%] h-[500px] w-[500px] rounded-full bg-[#518591]/8 blur-[100px]" />
            <div className="absolute right-[-5%] top-[20%] h-[400px] w-[400px] rounded-full bg-[#e3b01c]/8 blur-[100px]" />
            <div className="absolute left-1/2 top-[50%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#518591]/5 to-[#e3b01c]/5 blur-[80px]" />
          </div>

          {/* Hero Section */}
          <div className="relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#518591]/20 bg-white/80 px-4 py-1.5 backdrop-blur-sm">
                <Sparkles className="h-3 w-3 text-[#e3b01c]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#518591]">
                  Subscription Plans
                </span>
              </div>

              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-[#518591] via-[#2c3e3b] to-[#e3b01c] bg-clip-text text-transparent">
                  Choose your path
                </span>
                <span className="block mt-3 text-[#2c3e3b]/50 font-light">
                  to wellness
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-lg text-base text-[#2c3e3b]/55 font-light leading-relaxed">
                Select the plan that matches your journey.
                All subscriptions include a 7-day free trial.
              </p>
            </motion.div>
          </div>

          {/* Plans Grid */}
          <div className="relative mt-14 grid gap-6 md:grid-cols-3 lg:gap-8">
            {plans.map((plan, i) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                  className={`group relative rounded-[28px] bg-white p-7 lg:p-8 transition-all duration-500 hover:-translate-y-2 border-2 ${plan.borderColor} ${plan.hoverBorderColor} ${plan.popular ? "shadow-xl shadow-[#e3b01c]/10" : "shadow-sm hover:shadow-xl"}`}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#e3b01c] to-[#c49b0f] px-5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg shadow-[#e3b01c]/20">
                      Popular
                    </div>
                  )}

                  {/* Plan Icon */}
                  <div className="mb-5">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${plan.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                      <Icon className="h-6 w-6 text-[#518591]" />
                    </div>
                  </div>

                  {/* Plan Info */}
                  <h3 className="text-xl font-bold text-[#2c3e3b]">{plan.name}</h3>
                  <p className="mt-1.5 text-sm text-[#2c3e3b]/50 font-light">{plan.desc}</p>

                  {/* Price */}
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[#2c3e3b] tracking-tight">{plan.price}</span>
                    <span className="text-sm text-[#2c3e3b]/40 font-light">{plan.period}</span>
                  </div>

                  {/* Features */}
                  <ul className="mt-7 space-y-3 border-t border-[#518591]/10 pt-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-[#2c3e3b]/65 font-light">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#e3b01c]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <div className="mt-8">
                    <Link
                      href={`/subscription/payment?plan=${plan.id}`}
                      className={`group flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                        plan.popular
                          ? "bg-gradient-to-r from-[#518591] to-[#2c3e3b] text-white shadow-md shadow-[#518591]/20 hover:shadow-lg hover:-translate-y-0.5"
                          : "border-2 border-[#518591]/15 bg-white text-[#2c3e3b] hover:border-[#518591] hover:bg-[#518591]/5 hover:text-[#518591]"
                      }`}
                    >
                      Get Started
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative mt-14 flex flex-wrap items-center justify-center gap-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-[#518591]/10 px-8 py-5 text-sm text-[#2c3e3b]/55"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#e3b01c]" />
              <span className="font-light">Secure payment</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-[#518591]/15" />
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#e3b01c]" />
              <span className="font-light">Flexible cancellation</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-[#518591]/15" />
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#e3b01c]" />
              <span className="font-light">7-day free trial</span>
            </div>
          </motion.div>

          {/* FAQ Link */}
          <div className="mt-16 text-center">
            <h3 className="text-base font-semibold text-[#2c3e3b]">
              Frequently asked questions?
            </h3>
            <p className="mt-2 text-sm text-[#2c3e3b]/50 font-light">
              Have a question? Visit our{" "}
              <Link href="/faq" className="text-[#518591] hover:underline font-medium">
                help center
              </Link>{" "}
              or contact our team.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}