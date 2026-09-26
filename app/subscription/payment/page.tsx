"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Check, CreditCard, Loader2, Lock, ShieldCheck, User } from "lucide-react";
import { formatAed, getPlan, planCopyKey } from "@/lib/config/plans";
import { Button } from "@/components/ui/button";
import { FormField, IconInput } from "@/components/shared/FormField";
import { CardPreview } from "@/components/subscription/CardPreview";
import { CheckoutLayout } from "@/components/subscription/CheckoutLayout";
import { CheckoutSteps } from "@/components/subscription/CheckoutSteps";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANGS } from "@/lib/i18n/config";
import { fill } from "@/lib/i18n/format";
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion";

const REDIRECT_DELAY_MS = 2500;

function PaymentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { dictionary, language } = useLanguage();
  const copy = dictionary.payment;
  const plan = getPlan(searchParams.get("plan"));
  const planCopy = dictionary.subscription[planCopyKey(plan.id)];
  const formattedPrice = `${formatAed(plan.priceAed)} AED`;
  const zeroPrice = `${formatAed(0)} AED`;
  const [paid, setPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // Display-only mirror of the (uncontrolled) card fields for the live preview.
  const [preview, setPreview] = useState({ number: "4242 4242 4242 4242", expiry: "12/28", name: "Alex Morgan" });
  const mirror = (field: keyof typeof preview) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setPreview((current) => ({ ...current, [field]: event.target.value }));

  function handlePay(event: React.FormEvent) {
    event.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setPaid(true);
      setIsProcessing(false);
      setTimeout(() => router.push("/dashboard"), REDIRECT_DELAY_MS);
    }, 2500);
  }

  if (paid) {
    const locale = LANGS.find((item) => item.code === language)?.bcp47 ?? "en-US";
    const receipt = [
      { label: copy.success.orderId, value: <span className="font-mono text-teal-700" dir="ltr">#VM-PENDING</span> },
      {
        label: copy.success.date,
        value: new Date().toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric", numberingSystem: "latn" }),
      },
      { label: copy.success.amount, value: <span dir="ltr" className="font-semibold tabular-nums">{formattedPrice}</span> },
    ];

    return (
      <>
        <CheckoutSteps current={2} className="mb-10" />
        <motion.section
          aria-live="polite"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="mx-auto w-full max-w-lg"
        >
          <div className="relative overflow-hidden rounded-card border border-line bg-white px-5 py-8 text-center shadow-float sm:px-10 sm:py-10">
            <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-teal-500),var(--color-sage),var(--color-gold))]" />

            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
              className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-teal-50 ring-8 ring-teal-50/60"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-brand">
                <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
                  <motion.path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.45, ease: EASE_OUT }}
                  />
                </svg>
              </span>
            </motion.div>

            <motion.div variants={stagger(0.07, 0.2)} initial="hidden" animate="show">
              <motion.h1 variants={fadeUp(0, 10)} className="mt-6 text-title font-semibold text-ink">
                {copy.success.title}
              </motion.h1>
              <motion.p variants={fadeUp(0, 10)} className="mt-3 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3.5 py-1.5 text-xs font-medium text-teal-800">
                {copy.success.activePlan}: <strong className="font-semibold">{planCopy.name}</strong>
              </motion.p>
              <motion.p variants={fadeUp(0, 10)} className="mx-auto mt-4 max-w-sm text-[0.9375rem] leading-7 text-ink-muted">
                {fill(copy.success.body, { plan: planCopy.name })}
              </motion.p>

              <motion.dl variants={fadeUp(0, 10)} className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface-muted/60 px-4 text-start text-sm">
                {receipt.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-ink-muted">{row.label}</dt>
                    <dd className="text-end text-ink">{row.value}</dd>
                  </div>
                ))}
              </motion.dl>

              <motion.div variants={fadeUp(0, 10)} className="mt-7 grid gap-2.5 sm:grid-cols-2">
                <Button asChild variant="default" size="lg" className="group w-full">
                  <Link href="/dashboard">
                    {copy.success.dashboard}
                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/dashboard/settings">{copy.success.invoice}</Link>
                </Button>
              </motion.div>

              <motion.div variants={fadeUp(0, 10)} className="mt-6" role="status">
                <p className="text-xs text-ink-muted">{copy.success.redirecting}</p>
                <div className="mx-auto mt-2 h-1 max-w-48 overflow-hidden rounded-full bg-teal-100">
                  <motion.div
                    className="h-full origin-left rounded-full bg-teal-500 rtl:origin-right"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: REDIRECT_DELAY_MS / 1000, ease: "linear" }}
                  />
                </div>
              </motion.div>

              <motion.p variants={fadeUp(0, 10)} className="mt-6 text-xs leading-5 text-ink-muted">
                {copy.success.emailSent}{" "}
                {copy.success.help}{" "}
                <Link href="/support" className="font-semibold text-teal-700 underline-offset-4 hover:underline">
                  {copy.success.contact}
                </Link>
              </motion.p>
            </motion.div>
          </div>
        </motion.section>
      </>
    );
  }

  return (
    <>
      <CheckoutSteps current={1} className="mb-10" />
      <PaymentHero />
      <div className="mx-auto grid w-full max-w-5xl items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:gap-8">
        {/* Order summary — first on small screens so the plan is always confirmed before card details. */}
        <motion.aside
          aria-label={copy.summaryTitle}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: EASE_OUT }}
          className="surface-card p-5 sm:p-6 lg:sticky lg:top-28 lg:order-last"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="home-eyebrow">{copy.summaryTitle}</h2>
            <Link href="/subscription" className="rounded-md text-sm font-semibold text-teal-700 underline-offset-4 hover:underline">
              {copy.changePlan}
            </Link>
          </div>

          <div className="mt-4 flex items-start justify-between gap-4 rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
            <div className="min-w-0">
              <p className="font-semibold text-ink">{planCopy.name}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{copy.billedMonthly}</p>
            </div>
            <span dir="ltr" className="shrink-0 text-lg font-semibold tabular-nums text-ink">{formattedPrice}</span>
          </div>

          <ul className="mt-4 hidden space-y-2 sm:block">
            {planCopy.features.slice(0, 3).map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-soft">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage-700" aria-hidden />
                <span className="min-w-0">{feature}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-3 border-t border-line pt-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-ink-muted">{fill(copy.freeFor, { days: plan.trialDays })}</dt>
              <dd dir="ltr" className="font-medium tabular-nums text-sage-700">{zeroPrice}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
              <dt className="text-base font-semibold text-ink">{copy.totalToday}</dt>
              <dd dir="ltr" className="text-2xl font-semibold tabular-nums text-teal-700">{zeroPrice}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs leading-5 text-ink-muted">{fill(copy.thenAfter, { price: formattedPrice })}</p>

          <ul className="mt-5 space-y-2">
            {[
              { icon: ShieldCheck, text: copy.secureProcessed },
              { icon: Lock, text: copy.cardHandled },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 rounded-xl bg-surface-muted px-3.5 py-3 text-xs leading-5 text-ink-soft">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden />
                <span className="min-w-0">{text}</span>
              </li>
            ))}
          </ul>
        </motion.aside>

        {/* Payment form */}
        <motion.section
          aria-labelledby="payment-details-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE_OUT }}
          className="surface-glass p-5 sm:p-8"
        >
          <div className="mb-6 flex items-start gap-3">
            <span className="home-icon">
              <CreditCard className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 id="payment-details-title" className="text-lg font-semibold text-ink">{copy.detailsTitle}</h2>
              <p className="mt-0.5 text-sm text-ink-muted">{copy.detailsBody}</p>
            </div>
          </div>

          <div className="mb-8">
            <CardPreview
              number={preview.number}
              name={preview.name}
              expiry={preview.expiry}
              planName={planCopy.name}
              holderLabel={copy.cardholder}
              expiryLabel={copy.expiry}
            />
          </div>

          <form onSubmit={handlePay} aria-busy={isProcessing}>
            <fieldset disabled={isProcessing} className="space-y-5">
              <FormField id="pay-card-number" label={copy.cardNumber}>
                <IconInput id="pay-card-number" icon={CreditCard} type="text" dir="ltr" inputMode="numeric" autoComplete="cc-number" onChange={mirror("number")} defaultValue="4242 4242 4242 4242" placeholder="1234 5678 9012 3456" className="tabular-nums tracking-wide" required />
              </FormField>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField id="pay-expiry" label={copy.expiry}>
                  <IconInput id="pay-expiry" icon={Calendar} type="text" dir="ltr" inputMode="numeric" autoComplete="cc-exp" onChange={mirror("expiry")} defaultValue="12/28" placeholder="MM/YY" className="tabular-nums" required />
                </FormField>
                <FormField id="pay-cvc" label={copy.cvc}>
                  <IconInput id="pay-cvc" icon={Lock} type="text" dir="ltr" inputMode="numeric" autoComplete="cc-csc" defaultValue="123" placeholder="123" className="tabular-nums" required />
                </FormField>
              </div>

              <FormField id="pay-name" label={copy.cardholder}>
                <IconInput id="pay-name" icon={User} type="text" autoComplete="cc-name" onChange={mirror("name")} defaultValue="Alex Morgan" placeholder="John Doe" required />
              </FormField>

              <Button type="submit" variant="default" size="lg" aria-busy={isProcessing} className="group w-full min-h-13">
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden />
                    {copy.processing}
                  </>
                ) : (
                  <>
                    {copy.submit}
                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-ink-muted">{copy.cancelBefore}</p>
            </fieldset>
          </form>
        </motion.section>
      </div>
    </>
  );
}

function PaymentHero() {
  const { dictionary } = useLanguage();
  const copy = dictionary.payment;

  return (
    <motion.div variants={stagger(0.08)} initial="hidden" animate="show" className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
      <motion.p variants={fadeUp()} className="home-eyebrow home-eyebrow-pill">
        <Lock className="h-3.5 w-3.5 text-gold-600" aria-hidden />
        {copy.eyebrow}
      </motion.p>
      <motion.h1 variants={fadeUp()} className="home-heading mt-5">
        {copy.title}
      </motion.h1>
      <motion.p variants={fadeUp()} className="home-body mx-auto mt-4 max-w-lg">
        {copy.subtitle}
      </motion.p>
    </motion.div>
  );
}

function PaymentFallback() {
  const { dictionary } = useLanguage();
  return (
    <div className="flex justify-center py-16" role="status">
      <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white px-5 py-3 text-sm text-ink-soft shadow-card">
        <Loader2 className="h-4 w-4 animate-spin text-teal-600" aria-hidden />
        {dictionary.payment.loading}
      </span>
    </div>
  );
}

export default function PaymentPage() {
  const { dictionary } = useLanguage();
  const copy = dictionary.payment;

  return (
    <CheckoutLayout backHref="/subscription" backLabel={dictionary.nav.backToPlans}>
      <Suspense fallback={<PaymentFallback />}>
        <PaymentForm />
      </Suspense>
      <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-muted">
        {copy.trust.map((item) => (
          <li key={item} className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-sage-700" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </CheckoutLayout>
  );
}
