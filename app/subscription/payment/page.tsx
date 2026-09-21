"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Lock, ShieldCheck, Sparkles, CreditCard, Calendar, User, AlertCircle, ArrowLeft } from "lucide-react";
import Header from "../_components/Header";

const planData: Record<string, { name: string; price: string; period: string }> = {
  basic: { name: "Basic", price: "19,99TND", period: "month" },
  pro: { name: "Pro", price: "49,99TND", period: "month" },
  parents: { name: "Family", price: "69,99TND", period: "month" },
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
          className="relative overflow-hidden rounded-[28px] bg-white shadow-xl border-2 border-[#518591]/15"
        >
          {/* Premium Gradient Header */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#518591] via-[#2c3e3b] to-[#e3b01c]" />

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
              <div className="relative inline-flex">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.15, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-[#518591]/15"
                  style={{ width: 80, height: 80 }}
                />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#518591] to-[#2c3e3b] shadow-lg shadow-[#518591]/20">
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
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#518591]/8 px-4 py-1.5 border border-[#518591]/15"
            >
              <span className="text-xs font-medium text-[#518591]">Active Plan:</span>
              <span className="text-xs font-bold text-[#518591]">{plan.name}</span>
            </motion.div>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-sm leading-relaxed text-[#2c3e3b]/55 font-light"
            >
              Your subscription has been successfully activated.
              You now have full access to all {plan.name} features.
            </motion.p>

            {/* Receipt Preview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 rounded-xl border border-[#518591]/10 bg-[#518591]/3 p-4 text-left"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#2c3e3b]/45 font-light">Order ID</span>
                <span className="font-mono text-[#518591] text-xs font-medium">
                  #{Math.random().toString(36).substring(2, 10).toUpperCase()}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-[#2c3e3b]/45 font-light">Payment Date</span>
                <span className="font-medium text-[#2c3e3b] text-xs">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-[#518591]/10">
                <span className="text-[#2c3e3b]/45 font-light">Amount Paid</span>
                <span className="font-bold text-[#2c3e3b] text-xs">{plan.price}</span>
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
                className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#518591] to-[#2c3e3b] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#518591]/15 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/dashboard/settings"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#518591]/15 bg-white px-6 py-3 text-sm font-medium text-[#2c3e3b] transition-all hover:border-[#518591] hover:bg-[#518591]/3"
              >
                View Invoice
              </Link>
            </motion.div>

            {/* Help Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-xs text-[#2c3e3b]/40 font-light"
            >
              A confirmation email has been sent to your inbox.
              Need help? <Link href="/support" className="text-[#518591] hover:underline font-medium">Contact support</Link>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
      {/* Payment Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-[28px] bg-white border-2 border-[#518591]/10 p-6 sm:p-8 shadow-sm"
      >
        {/* Back button */}
        <Link
          href="/subscription"
          className="inline-flex items-center gap-2 text-sm text-[#2c3e3b]/50 hover:text-[#518591] transition-colors mb-6 font-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to plans
        </Link>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#2c3e3b]">Payment Details</h2>
          <p className="mt-1 text-sm text-[#2c3e3b]/50 font-light">
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
              <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2c3e3b]/25" />
              <input
                type="text"
                defaultValue="4242 4242 4242 4242"
                placeholder="1234 5678 9012 3456"
                className="w-full rounded-xl border-2 border-[#518591]/10 bg-white py-3 pl-10 pr-4 text-sm text-[#2c3e3b] outline-none transition-all focus:border-[#518591] focus:ring-2 focus:ring-[#518591]/10 font-light placeholder:text-[#2c3e3b]/25"
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
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2c3e3b]/25" />
                <input
                  type="text"
                  defaultValue="12/28"
                  placeholder="MM/YY"
                  className="w-full rounded-xl border-2 border-[#518591]/10 bg-white py-3 pl-10 pr-4 text-sm text-[#2c3e3b] outline-none transition-all focus:border-[#518591] focus:ring-2 focus:ring-[#518591]/10 font-light placeholder:text-[#2c3e3b]/25"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#518591]">
                CVC
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2c3e3b]/25" />
                <input
                  type="text"
                  defaultValue="123"
                  placeholder="123"
                  className="w-full rounded-xl border-2 border-[#518591]/10 bg-white py-3 pl-10 pr-4 text-sm text-[#2c3e3b] outline-none transition-all focus:border-[#518591] focus:ring-2 focus:ring-[#518591]/10 font-light placeholder:text-[#2c3e3b]/25"
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
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2c3e3b]/25" />
              <input
                type="text"
                defaultValue="Alex Morgan"
                placeholder="John Doe"
                className="w-full rounded-xl border-2 border-[#518591]/10 bg-white py-3 pl-10 pr-4 text-sm text-[#2c3e3b] outline-none transition-all focus:border-[#518591] focus:ring-2 focus:ring-[#518591]/10 font-light placeholder:text-[#2c3e3b]/25"
                required
              />
            </div>
          </div>

          {/* Support Notice */}
          <div className="flex items-start gap-3 rounded-xl border-2 border-[#e3b01c]/15 bg-[#e3b01c]/3 p-4">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#e3b01c] mt-0.5" />
            <div className="text-xs text-[#c49b0f]">
              <p className="font-semibold uppercase tracking-wider">Payment Status</p>
              <p className="mt-1 opacity-90 leading-relaxed font-light">
                If your payment was not successful or is currently pending, please contact
                our support team immediately for assistance.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#518591] to-[#2c3e3b] px-6 py-4 text-sm font-semibold text-white shadow-md shadow-[#518591]/15 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70"
          >
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
        className="sticky top-24 h-fit rounded-[28px] bg-white border-2 border-[#518591]/10 p-6 shadow-sm"
      >
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#518591]">
          Order Summary
        </h3>

        <div className="mt-6 space-y-4">
          {/* Plan Selection */}
          <div className="flex items-center justify-between border-b border-[#518591]/10 pb-4">
            <div>
              <p className="font-semibold text-[#2c3e3b]">{plan.name} Plan</p>
              <p className="text-xs text-[#2c3e3b]/45 font-light">Billed {plan.period}ly</p>
            </div>
            <span className="text-lg font-bold text-[#2c3e3b]">{plan.price}</span>
          </div>

          {/* Trial Credit */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#2c3e3b]/50 font-light">7-day free trial</span>
            <span className="text-sm font-medium text-[#e3b01c]">-$0.00</span>
          </div>

          {/* Total */}
          <div className="border-t border-[#518591]/10 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-[#2c3e3b]">Total due today</span>
              <span className="text-2xl font-bold text-[#518591]">{plan.price}</span>
            </div>
            <p className="mt-2 text-xs text-[#2c3e3b]/40 font-light">
              You will be charged {plan.price} {plan.period}ly after your trial ends.
              Cancel anytime.
            </p>
          </div>
        </div>

        {/* Security Badges */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-[#518591]/10 bg-[#518591]/3 px-4 py-3">
            <ShieldCheck className="h-4 w-4 text-[#e3b01c]" />
            <span className="text-xs text-[#2c3e3b]/55 font-light">
              256-bit SSL encryption
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[#518591]/10 bg-[#518591]/3 px-4 py-3">
            <Lock className="h-4 w-4 text-[#e3b01c]" />
            <span className="text-xs text-[#2c3e3b]/55 font-light">
              PCI DSS compliant
            </span>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[#2c3e3b]/40 font-light">
            🔒 30-day money-back guarantee • No hidden fees
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
           <Header  />
     

      {/* Main Content */}
      <main className="flex-1">
        <div className="relative mx-auto  px-6 pb-24 pt-12 sm:px-8 lg:px-12">
          {/* Background orbs */}
          <div className="pointer-events-none max-w-7xl absolute inset-0 overflow-hidden">
            <div className="absolute left-[-5%] top-[-5%] h-[500px] w-[500px] rounded-full bg-[#518591]/6 blur-[100px]" />
            <div className="absolute right-[-5%] top-[20%] h-[400px] w-[400px] rounded-full bg-[#e3b01c]/6 blur-[100px]" />
            <div className="absolute left-1/2 top-[50%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#518591]/4 to-[#e3b01c]/4 blur-[80px]" />
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
                  Secure Checkout
                </span>
              </div>

              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-[#518591] via-[#2c3e3b] to-[#e3b01c] bg-clip-text text-transparent">
                  Complete your subscription
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-lg text-base text-[#2c3e3b]/55 font-light leading-relaxed">
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
                  <span className="text-sm font-light">Loading secure checkout...</span>
                </div>
              </div>
            }
          >
            <PaymentForm />
          </Suspense>

          {/* Footer Trust Signals */}
          <div className="mt-16 text-center">
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#2c3e3b]/40 font-light">
              <span>✓ Money-back guarantee</span>
              <span>✓ Cancel anytime</span>
              <span>✓ Secure payments</span>
              <span>✓ 24/7 support</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}