"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Calendar, Check, CreditCard, Lock, ShieldCheck, User } from "lucide-react";
import { formatMoney, planFeatureLines, tierCopyKey } from "@/lib/config/plans";
import { invalidatePatientData } from "@/hooks/usePatientResource";
import { usePlans } from "@/hooks/usePlans";
import { billingApi } from "@/lib/api/billing";
import { ApiError } from "@/lib/api/client";
import { isAuthenticated } from "@/lib/api/tokens";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/home/SectionHeader";
import { PlanBenefits, PlanPrice } from "@/components/pricing/PlanColumn";
import { FormField, IconInput } from "@/components/shared/FormField";
import { CardPreview } from "@/components/subscription/CardPreview";
import { CheckoutLayout } from "@/components/subscription/CheckoutLayout";
import { CheckoutSteps } from "@/components/subscription/CheckoutSteps";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANGS } from "@/lib/i18n/config";
import { fill } from "@/lib/i18n/format";
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion";
import { LogoLoader, LogoSpinner } from "@/components/shared/LogoLoader";

const REDIRECT_DELAY_MS = 2500;

function PaymentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { dictionary, language } = useLanguage();
  const copy = dictionary.payment;
  const plans = usePlans();
  // The plan comes from the database: the one named in the link, else the one available plan.
  const plan = plans.data?.find((item) => item.id === searchParams.get("plan")) ?? plans.plan;
  const locale = LANGS.find((item) => item.code === language)?.bcp47 ?? "en-US";
  const planCopy = plan ? dictionary.subscription[tierCopyKey(plan.tier)] : null;
  const formattedPrice = plan ? formatMoney(plan.price, plan.currency, locale) : "";
  const [paid, setPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyActive, setAlreadyActive] = useState(false);
  // Display-only mirror of the (uncontrolled) card fields for the live preview.
  const [preview, setPreview] = useState({ number: "4242 4242 4242 4242", expiry: "12/28", name: "Alex Morgan" });
  const mirror = (field: keyof typeof preview) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setPreview((current) => ({ ...current, [field]: event.target.value }));

  // Idempotency guard: if the subscription is already active, never offer to pay again.
  useEffect(() => {
    if (!isAuthenticated()) return;
    let active = true;
    billingApi
      .mySubscription()
      .then((data) => {
        if (active && data?.hasActiveSubscription) setAlreadyActive(true);
      })
      .catch(() => {
        /* ignore — the completion call still guards against double activation */
      });
    return () => {
      active = false;
    };
  }, []);

  async function handlePay(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (alreadyActive || !plan) return;

    if (!isAuthenticated()) {
      // Funnel integrity: must be signed in first. Return here after signup.
      router.push(`/auth/signup?redirect=${encodeURIComponent(`/subscription/payment?plan=${plan.id}`)}`);
      return;
    }

    setIsProcessing(true);
    try {
      await billingApi.complete(plan.id);
      // The subscription lives in the database: refresh every view of it.
      invalidatePatientData("billing");
      setPaid(true);
      setIsProcessing(false);
      setTimeout(() => router.push("/dashboard"), REDIRECT_DELAY_MS);
    } catch (err) {
      if (err instanceof ApiError && (err.isConflict || err.code === "SUBSCRIPTION_ALREADY_ACTIVE")) {
        invalidatePatientData("billing");
        setAlreadyActive(true);
      } else {
        setError(err instanceof ApiError && err.status !== 0 ? err.message : copy.errorGeneric);
      }
      setIsProcessing(false);
    }
  }

  if (!plan || !planCopy) {
    return plans.isLoading ? (
      <PaymentFallback />
    ) : (
      <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-[1.75rem] border border-rose-100 bg-rose-50 p-8 text-center">
        <AlertCircle className="h-6 w-6 text-rose-700" aria-hidden />
        <p className="font-semibold text-ink">{dictionary.subscription.plansUnavailableTitle}</p>
        <p className="text-sm text-ink-soft">{dictionary.subscription.plansUnavailableBody}</p>
        <Button variant="outline" onClick={() => void plans.refresh()}>
          {dictionary.subscription.retry}
        </Button>
      </div>
    );
  }

  if (paid) {
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
          <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-white px-5 py-8 text-center sm:px-10 sm:py-10">
            <div aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-primary" />

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
              <motion.p variants={fadeUp(0, 10)} className="mt-3 inline-flex items-center gap-2 rounded-full border border-sage-100 bg-sage-50 px-3.5 py-1.5 text-xs font-medium text-sage-700">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-sage-700" />
                {copy.success.activePlan}: <strong className="font-semibold">{planCopy.name}</strong>
              </motion.p>
              <motion.p variants={fadeUp(0, 10)} className="mx-auto mt-4 max-w-sm text-[0.9375rem] leading-7 text-ink-muted">
                {fill(copy.success.body, { plan: planCopy.name })}
              </motion.p>

              <motion.dl variants={fadeUp(0, 10)} className="mt-6 divide-y divide-line border-y border-line text-start text-sm">
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
                    <ArrowRight className="transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
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

  if (alreadyActive) {
    return (
      <>
        <CheckoutSteps current={1} className="mb-10" />
        <motion.section
          aria-live="polite"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE_OUT }}
          className="mx-auto w-full max-w-lg"
        >
          <div className="rounded-[1.75rem] border border-line bg-white p-6 text-center sm:p-8">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-50 text-sage-700">
              <ShieldCheck className="h-6 w-6" aria-hidden />
            </span>
            <h1 className="mt-4 text-title font-semibold text-ink">{copy.alreadyActiveTitle}</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-muted">{copy.alreadyActiveBody}</p>
            <Button asChild variant="default" size="lg" className="group mt-6 w-full sm:w-auto">
              <Link href="/dashboard">
                {copy.goToDashboard}
                <ArrowRight className="transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
              </Link>
            </Button>
          </div>
        </motion.section>
      </>
    );
  }

  return (
    <>
      <CheckoutSteps current={1} className="mb-10" />
      <PaymentHero />
      <div className="mx-auto grid w-full max-w-6xl items-start gap-5 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-8">
        {/* Order summary — first on small screens so the plan is always confirmed before card details. */}
        <motion.aside
          aria-label={copy.summaryTitle}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: EASE_OUT }}
          className="rounded-[1.75rem] border border-line bg-white p-5 sm:p-7 lg:sticky lg:top-24 lg:order-last"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="home-label text-ink-muted">{copy.summaryTitle}</h2>
            <Link href="/subscription" className="inline-flex min-h-10 items-center rounded-md text-sm font-semibold text-teal-700 underline-offset-4 hover:underline">
              {copy.changePlan}
            </Link>
          </div>

          {/* The chosen plan, in the same emphasis surface it had on the plan step. */}
          <div className="relative mt-3 overflow-hidden rounded-2xl bg-teal-50/60 p-4 sm:p-5">
            <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-primary" />
            <p className="text-lg font-semibold text-ink">{planCopy.name}</p>
            <PlanPrice amount={plan.price} currency={plan.currency} size="sm" className="mt-2" />
            <p className="mt-1.5 text-xs text-ink-muted">{copy.billedMonthly}</p>
          </div>

          <PlanBenefits features={planFeatureLines(plan, dictionary.subscription.planFeature).slice(0, 3)} className="mt-5 hidden sm:block" />

          <dl className="mt-5 space-y-3 border-t border-line pt-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-base font-semibold text-ink">{copy.totalToday}</dt>
              <dd dir="ltr" className="text-2xl font-semibold tabular-nums text-teal-700">{formattedPrice}</dd>
            </div>
          </dl>

          <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
            {[
              { icon: ShieldCheck, text: copy.secureProcessed },
              { icon: Lock, text: copy.cardHandled },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-xs leading-5 text-ink-muted">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden />
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
          className="rounded-[1.75rem] border border-line bg-white p-5 sm:p-8"
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

          {error && (
            <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-100 bg-rose-50 px-3.5 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" aria-hidden />
              <p className="text-[0.8125rem] leading-5 text-rose-700">{error}</p>
            </div>
          )}

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
                    <LogoSpinner size={18} />
                    {copy.processing}
                  </>
                ) : (
                  <>
                    {copy.submit}
                    <ArrowRight className="transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
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
    <SectionHeader id="payment-title" as="h1" align="center" eyebrow={copy.eyebrow} titleA={copy.title} intro={copy.subtitle} className="mb-10 sm:mb-14" />
  );
}

function PaymentFallback() {
  const { dictionary } = useLanguage();
  return (
    <LogoLoader label={dictionary.payment.loading} size={64} className="py-16" />
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
