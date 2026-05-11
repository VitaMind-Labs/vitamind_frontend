"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Brain, CheckCircle2, Lock, ShieldCheck, Sparkles } from "lucide-react";

const planData: Record<string, { name: string; price: string }> = {
  basic: { name: "Basic", price: "$9.99" },
  pro: { name: "Pro", price: "$19.99" },
  parents: { name: "Parents", price: "$29.99" },
};

function PaymentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("plan") || "basic";
  const plan = planData[planId] || planData.basic;
  const [paid, setPaid] = useState(false);

  function handlePay(event: React.FormEvent) {
    event.preventDefault();
    setPaid(true);
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  if (paid) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto mt-8 max-w-md text-center"
      >
        <div className="card-cinema p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary-dark">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-black">Payment successful!</h2>
          <p className="mt-3 text-sm leading-6 text-black/55">
            Welcome to the <strong>{plan.name}</strong> plan. Redirecting to your dashboard…
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
          >
            Go to dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="card-cinema p-6 sm:p-8"
      >
        <h2 className="text-xl font-semibold text-black">Payment details</h2>
        <p className="mt-2 text-sm text-black/45">Secure payment. Your data is encrypted.</p>

        <form onSubmit={handlePay} className="mt-8 space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-black/40">Card number</label>
            <input
              defaultValue="4242 4242 4242 4242"
              className="w-full rounded-2xl border border-black/8 bg-[#fdfdfc] px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/6"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-black/40">Expiry date</label>
              <input
                defaultValue="12/28"
                className="w-full rounded-2xl border border-black/8 bg-[#fdfdfc] px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/6"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-black/40">CVC</label>
              <input
                defaultValue="123"
                className="w-full rounded-2xl border border-black/8 bg-[#fdfdfc] px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/6"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-black/40">Cardholder name</label>
            <input
              defaultValue="Alex Morgan"
              className="w-full rounded-2xl border border-black/8 bg-[#fdfdfc] px-4 py-3 text-sm outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/6"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary-light/40 px-4 py-3 text-xs text-primary-dark">
            <Lock className="h-4 w-4 shrink-0" />
            This is a static demo. No real payment will be processed.
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5"
          >
            Pay {plan.price} <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="card-cinema p-6"
      >
        <h3 className="text-sm font-semibold text-black/70">Order summary</h3>
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-black/55">{plan.name} plan</span>
            <span className="font-medium text-black">{plan.price}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-black/55">Trial credit</span>
            <span className="font-medium text-primary-dark">-$0.00</span>
          </div>
          <div className="border-t border-black/8 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-black">Total</span>
              <span className="text-lg font-semibold text-black">{plan.price}</span>
            </div>
            <p className="mt-1 text-xs text-black/35">Billed monthly · Cancel anytime</p>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-black/6 bg-white/60 px-4 py-3 text-xs text-black/45">
          <ShieldCheck className="h-4 w-4 text-primary-dark" />
          Secured with 256-bit encryption
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[-10rem] top-[6rem] h-[30rem] w-[30rem] rounded-full bg-[#dceccb]/50 blur-[120px]" />
        <div className="absolute right-[-8rem] top-[18rem] h-[26rem] w-[26rem] rounded-full bg-[#dfe8f5]/65 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(183,216,156,0.12),transparent_25%),radial-gradient(circle_at_80%_15%,rgba(223,232,245,0.5),transparent_20%),linear-gradient(180deg,#fafaf8_0%,#f6f5ef_48%,#fafaf8_100%)]" />
        <div className="grain-overlay absolute inset-0 opacity-[0.06]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[98rem] px-6 pb-16 pt-6 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between border-b border-black/8 pb-6">
          <Link href="/subscription" className="flex items-center gap-4">
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
              <div className="text-sm text-black/45">Secure checkout</div>
            </div>
          </Link>
          <div className="flex items-center gap-2 text-xs text-black/40">
            <Lock className="h-3.5 w-3.5" />
            Secure connection
          </div>
        </header>

        <div className="mt-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-dark">
              <Sparkles className="h-3.5 w-3.5" />
              Checkout
            </div>
            <h1 className="mt-6 text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
              Complete your subscription.
            </h1>
          </motion.div>
        </div>

        <Suspense fallback={<div className="mt-20 text-center text-sm text-black/40">Loading…</div>}>
          <PaymentForm />
        </Suspense>
      </div>
    </div>
  );
}
