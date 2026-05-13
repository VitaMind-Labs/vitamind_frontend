"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Lock, ShieldCheck, Sparkles, CreditCard, Calendar, User, AlertCircle } from "lucide-react";

const planData: Record<string, { name: string; price: string; period: string }> = {
  basic: { name: "Basic", price: "$9.99", period: "month" },
  pro: { name: "Pro", price: "$19.99", period: "month" },
  parents: { name: "Parents", price: "$29.99", period: "month" },
};

function PaymentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("plan") || "basic";
  const plan = planData[planId] || planData.basic;
  const [paid, setPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  function handlePay(event: React.FormEvent) {
    event.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setPaid(true);
      setIsProcessing(false);
      setTimeout(() => router.push("/dashboard"), 2500);
    }, 2500);
  }

  if (paid) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="mx-auto mt-12 max-w-lg"
      >
        <motion.div
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          {/* Premium Gradient Header */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#518591] via-[#3d6a73] to-[#e3b01c]" />

          {/* Confetti/Sparkle Effect Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#518591]/5 via-transparent to-[#e3b01c]/5" />

          <div className="relative p-10 text-center">
            {/* Success Icon Container */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="mx-auto mb-6"
            >
              <div className="relative">
                {/* Outer ring animation */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-[#518591]/20"
                  style={{ width: 80, height: 80, margin: "0 auto" }}
                />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#518591] to-[#3d6a73] shadow-xl">
                  <CheckCircle2 className="h-10 w-10 text-white" strokeWidth={1.5} />
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-[#2c3e3b]"
            >
              Payment Confirmed
            </motion.h2>

            {/* Subscription Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#518591]/10 px-4 py-1.5"
            >
              <span className="text-xs font-medium text-[#518591]">Active Plan:</span>
              <span className="text-xs font-bold text-[#518591]">{plan.name}</span>
            </motion.div>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-sm leading-relaxed text-[#2c3e3b]/60"
            >
              Your subscription has been successfully activated.
              You now have full access to all {plan.name} features.
            </motion.p>

            {/* Receipt Preview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 rounded-xl border border-[#518591]/10 bg-[#518591]/5 p-4 text-left"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#2c3e3b]/50">Order ID</span>
                <span className="font-mono text-[#518591]">
                  #{Math.random().toString(36).substring(2, 10).toUpperCase()}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-[#2c3e3b]/50">Payment Date</span>
                <span className="font-medium text-[#2c3e3b]">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-[#518591]/10">
                <span className="text-[#2c3e3b]/50">Amount Paid</span>
                <span className="font-bold text-[#2c3e3b]">{plan.price}</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 space-y-3"
            >
              <Link
                href="/dashboard"
                className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#518591] to-[#3d6a73] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#e3b01c]/0 via-[#e3b01c]/20 to-[#e3b01c]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                Go to Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/dashboard/settings"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#518591]/20 bg-white px-6 py-3 text-sm font-medium text-[#2c3e3b]/70 transition-all hover:border-[#518591] hover:bg-[#518591]/5 hover:text-[#518591]"
              >
                View Invoice
              </Link>
            </motion.div>

            {/* Help Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-xs text-[#2c3e3b]/40"
            >
              A confirmation email has been sent to your inbox.
              Need help? <Link href="/support" className="text-[#518591] hover:underline">Contact support</Link>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto mt-5 grid max-w-6xl gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
      {/* Payment Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl bg-white/80 backdrop-blur-sm border border-[#518591]/10 p-6 shadow-xl sm:p-8"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#2c3e3b]">Payment Details</h2>
          <p className="mt-1 text-sm text-[#2c3e3b]/50">
            All transactions are secure and encrypted.
          </p>
        </div>

        <form onSubmit={handlePay} className="space-y-5">
          {/* Card Number */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#518591]">
              Card Number
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0B0B0]" />
              <input
                type="text"
                defaultValue="4242 4242 4242 4242"
                placeholder="1234 5678 9012 3456"
                className="w-full rounded-xl border border-[#518591]/10 bg-white py-3 pl-10 pr-4 text-sm text-[#2c3e3b] outline-none transition-all focus:border-[#518591] focus:ring-2 focus:ring-[#518591]/20"
                required
              />
            </div>
          </div>

          {/* Expiry & CVC */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#518591]">
                Expiry Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0B0B0]" />
                <input
                  type="text"
                  defaultValue="12/28"
                  placeholder="MM/YY"
                  className="w-full rounded-xl border border-[#518591]/10 bg-white py-3 pl-10 pr-4 text-sm text-[#2c3e3b] outline-none transition-all focus:border-[#518591] focus:ring-2 focus:ring-[#518591]/20"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#518591]">
                CVC
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0B0B0]" />
                <input
                  type="text"
                  defaultValue="123"
                  placeholder="123"
                  className="w-full rounded-xl border border-[#518591]/10 bg-white py-3 pl-10 pr-4 text-sm text-[#2c3e3b] outline-none transition-all focus:border-[#518591] focus:ring-2 focus:ring-[#518591]/20"
                  required
                />
              </div>
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#518591]">
              Cardholder Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0B0B0]" />
              <input
                type="text"
                defaultValue="Alex Morgan"
                placeholder="John Doe"
                className="w-full rounded-xl border border-[#518591]/10 bg-white py-3 pl-10 pr-4 text-sm text-[#2c3e3b] outline-none transition-all focus:border-[#518591] focus:ring-2 focus:ring-[#518591]/20"
                required
              />
            </div>
          </div>

          {/* Support Notice */}
          <div className="flex items-start gap-3 rounded-xl border border-[#e3b01c]/20 bg-[#e3b01c]/5 p-4">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#e3b01c] mt-0.5" />
            <div className="text-xs text-[#c49b0f]">
              <p className="font-semibold uppercase tracking-wider">Payment Status</p>
              <p className="mt-1 opacity-90 leading-relaxed">
                If your payment was not successful or is currently pending, please contact
                our support team immediately for assistance.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#518591] to-[#3d6a73] px-6 py-4 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-70"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#e3b01c]/0 via-[#e3b01c]/20 to-[#e3b01c]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Pay {plan.price}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </button>
        </form>
      </motion.div>

      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="sticky top-24 h-fit rounded-2xl bg-white/80 backdrop-blur-sm border border-[#518591]/10 p-6 shadow-xl"
      >
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#518591]">
          Order Summary
        </h3>

        <div className="mt-6 space-y-4">
          {/* Plan Selection */}
          <div className="flex items-center justify-between border-b border-[#518591]/10 pb-4">
            <div>
              <p className="font-semibold text-[#2c3e3b]">{plan.name} Plan</p>
              <p className="text-xs text-[#2c3e3b]/50">Billed {plan.period}ly</p>
            </div>
            <span className="text-lg font-bold text-[#2c3e3b]">{plan.price}</span>
          </div>

          {/* Trial Credit */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#2c3e3b]/60">7-day free trial</span>
            <span className="text-sm font-medium text-[#e3b01c]">-$0.00</span>
          </div>

          {/* Total */}
          <div className="border-t border-[#518591]/10 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-[#2c3e3b]">Total due today</span>
              <span className="text-2xl font-bold text-[#518591]">{plan.price}</span>
            </div>
            <p className="mt-2 text-xs text-[#2c3e3b]/40">
              You will be charged {plan.price} {plan.period}ly after your trial ends.
              Cancel anytime.
            </p>
          </div>
        </div>

        {/* Security Badges */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-[#518591]/10 bg-[#518591]/5 px-4 py-3">
            <ShieldCheck className="h-4 w-4 text-[#e3b01c]" />
            <span className="text-xs text-[#2c3e3b]/60">
              256-bit SSL encryption
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[#518591]/10 bg-[#518591]/5 px-4 py-3">
            <Lock className="h-4 w-4 text-[#e3b01c]" />
            <span className="text-xs text-[#2c3e3b]/60">
              PCI DSS compliant
            </span>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[#2c3e3b]/40">
            🔒 30-day money-back guarantee • No hidden fees
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <div className="relative min-h-screen bg-[#F0F0F0] text-[#2c3e3b]">
      {/* Background Elements */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute left-[-10rem] top-[6rem] h-[30rem] w-[30rem] rounded-full bg-[#518591]/20 blur-[120px]"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute right-[-8rem] top-[18rem] h-[26rem] w-[26rem] rounded-full bg-[#e3b01c]/15 blur-[130px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(81,133,145,0.08),transparent_40%),radial-gradient(circle_at_80%_15%,rgba(227,176,28,0.06),transparent_30%)]" />
        <div className="grain-overlay absolute inset-0 opacity-[0.03]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[98rem] px-6 pb-20 pt-5 sm:px-10 lg:px-16">


        {/* Hero Section */}
        <div className="mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#518591]/20 bg-white/60 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#e3b01c]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#518591]">
                Secure Checkout
              </span>
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-[#518591] to-[#e3b01c] bg-clip-text text-transparent">
                Complete your subscription
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-[#2c3e3b]/60">
              Join thousands of users who trust VitaMind for their mental wellness journey
            </p>
          </motion.div>
        </div>

        {/* Payment Form with Suspense */}
        <Suspense
          fallback={
            <div className="mt-20 text-center">
              <div className="inline-flex items-center gap-2 text-[#518591]">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#518591]/30 border-t-[#518591]" />
                <span className="text-sm">Loading secure checkout...</span>
              </div>
            </div>
          }
        >
          <PaymentForm />
        </Suspense>

        {/* Footer Trust Signals */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#2c3e3b]/40">
            <span>✓ Money-back guarantee</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Secure payments</span>
            <span>✓ 24/7 support</span>
          </div>
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