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
import { Grain } from "@/components/home/Atmosphere";
import { CountUp } from "@/components/home/CountUp";
import { splitPrice } from "@/components/home/PlanCard";
import { SectionHeader } from "@/components/home/SectionHeader";
import { DISPLAY_M, DISPLAY_S, LABEL, SERIF } from "@/components/home/typography";
import { FormField, IconInput } from "@/components/shared/FormField";
import { CardPreview } from "@/components/subscription/CardPreview";
import { CheckoutLayout } from "@/components/subscription/CheckoutLayout";
import { CheckoutSteps } from "@/components/subscription/CheckoutSteps";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANGS } from "@/lib/i18n/config";
import { fill } from "@/lib/i18n/format";
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion";
import { LogoLoader, LogoSpinner } from "@/components/shared/LogoLoader";
import { cn } from "@/lib/utils";

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
      <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-panel border border-rose-100 bg-rose-50 p-8 text-center">
        <AlertCircle className="h-6 w-6 text-rose-700" aria-hidden />
        <p className="font-semibold text-ink">{dictionary.subscription.plansUnavailableTitle}</p>
        <p className="text-[0.9375rem] text-ink-soft">{dictionary.subscription.plansUnavailableBody}</p>
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
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          className="mx-auto w-full max-w-xl"
        >
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-line bg-white px-6 py-10 text-center shadow-float sm:px-12 sm:py-14">
            <span aria-hidden className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <span aria-hidden className="pointer-events-none absolute -top-28 start-1/2 -z-10 size-72 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(201_175_111/0.22),transparent)] rtl:translate-x-1/2" />

            {/* The check draws itself inside rings that open outward, once */}
            <div className="relative mx-auto flex size-24 items-center justify-center">
              {[0, 1].map((i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="absolute inset-0 rounded-full border border-gold"
                  initial={{ scale: 0.6, opacity: 0.7 }}
                  animate={{ scale: 1.9, opacity: 0 }}
                  transition={{ duration: 1.8, delay: 0.5 + i * 0.4, ease: "easeOut" }}
                />
              ))}
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.1 }}
                className="flex size-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_25%,var(--color-teal-600),var(--color-teal-900))] text-white shadow-brand ring-8 ring-teal-50"
              >
                <svg viewBox="0 0 24 24" className="size-9" aria-hidden>
                  <motion.path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, delay: 0.5, ease: EASE_OUT }}
                  />
                </svg>
              </motion.span>
            </div>

            <motion.div variants={stagger(0.08, 0.3)} initial="hidden" animate="show">
              <motion.h1 variants={fadeUp(0, 12)} className={cn(DISPLAY_M, "mt-8 text-[clamp(2rem,2vw+1.4rem,3rem)] text-ink")}>
                {copy.success.title}
              </motion.h1>
              <motion.p variants={fadeUp(0, 12)} className={cn(LABEL, "mt-5 inline-flex items-center gap-2.5 rounded-full border border-sage-100 bg-sage-50 px-4 py-2 text-sage-700")}>
                <span aria-hidden className="size-1.5 rounded-full bg-sage-700" />
                {copy.success.activePlan}: <strong className="font-semibold">{planCopy.name}</strong>
              </motion.p>
              <motion.p variants={fadeUp(0, 12)} className="mx-auto mt-5 max-w-sm text-[1.0625rem] leading-8 text-ink-soft">
                {fill(copy.success.body, { plan: planCopy.name })}
              </motion.p>

              <motion.dl variants={fadeUp(0, 12)} className="mt-8 divide-y divide-line-strong/60 border-y border-line-strong/60 text-start text-[0.9375rem]">
                {receipt.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4 py-3.5">
                    <dt className="text-ink-soft">{row.label}</dt>
                    <dd className="text-end text-ink">{row.value}</dd>
                  </div>
                ))}
              </motion.dl>

              <motion.div variants={fadeUp(0, 12)} className="mt-8 grid gap-3 sm:grid-cols-2">
                <Button asChild variant="default" size="lg" className="group min-h-14 w-full shadow-brand">
                  <Link href="/dashboard">
                    {copy.success.dashboard}
                    <ArrowRight className="transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="min-h-14 w-full">
                  <Link href="/dashboard/settings">{copy.success.invoice}</Link>
                </Button>
              </motion.div>

              <motion.div variants={fadeUp(0, 12)} className="mt-7" role="status">
                <p className="text-[0.875rem] text-ink-soft">{copy.success.redirecting}</p>
                <div className="mx-auto mt-3 h-px max-w-56 overflow-hidden bg-line-strong">
                  <motion.div
                    className="h-full origin-left bg-gold rtl:origin-right"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: REDIRECT_DELAY_MS / 1000, ease: "linear" }}
                  />
                </div>
              </motion.div>

              <motion.p variants={fadeUp(0, 12)} className="mt-7 text-[0.875rem] leading-6 text-ink-soft">
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
          <div className="rounded-[2rem] border border-line bg-white p-8 text-center shadow-float sm:p-12">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-sage-50 text-sage-700 ring-8 ring-sage-50/60">
              <ShieldCheck className="size-7" strokeWidth={1.5} aria-hidden />
            </span>
            <h1 className={cn(DISPLAY_M, "mt-6 text-[clamp(1.75rem,1.6vw+1.3rem,2.5rem)] text-ink")}>{copy.alreadyActiveTitle}</h1>
            <p className="mx-auto mt-3 max-w-sm text-[1rem] leading-7 text-ink-soft">{copy.alreadyActiveBody}</p>
            <Button asChild variant="default" size="lg" className="group mt-8 min-h-14 w-full px-8 shadow-brand sm:w-auto">
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

  const price = splitPrice(plan.price, plan.currency);

  return (
    <>
      <CheckoutSteps current={1} className="mb-12" />
      <PaymentHero />
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-10">
        {/* Order summary — first on small screens so the plan is always confirmed before card details. */}
        <motion.aside
          aria-label={copy.summaryTitle}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE_OUT }}
          className="relative isolate overflow-hidden rounded-[2rem] bg-deep p-7 text-white shadow-float sm:p-9 lg:sticky lg:top-28 lg:order-last"
        >
          <Grain />

          <div className="flex items-center justify-between gap-3">
            <h2 className={cn(LABEL, "text-teal-200")}>{copy.summaryTitle}</h2>
            <Link href="/subscription" className="inline-flex min-h-10 items-center rounded-md text-[0.9375rem] font-semibold text-gold-300 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-gold-300">
              {copy.changePlan}
            </Link>
          </div>

          <p className={cn(DISPLAY_S, "mt-7 text-white")}>{planCopy.name}</p>
          <p className="mt-4 flex items-baseline gap-2" dir="ltr">
            <span className={cn(SERIF, "text-[1.5rem] font-light text-gold-300")}>{price.symbol}</span>
            <span className={cn(SERIF, "text-[4rem] font-light leading-none tracking-[-0.045em] tabular-nums")}>
              <CountUp value={price.figure} />
            </span>
          </p>
          <p className="mt-3 text-[0.9375rem] text-teal-100">{copy.billedMonthly}</p>

          <ul className="mt-7 hidden space-y-3 border-t border-white/15 pt-6 sm:block">
            {planFeatureLines(plan, dictionary.subscription.planFeature)
              .slice(0, 3)
              .map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-[0.9375rem] leading-6 text-white/90">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-gold-300/40 bg-gold/15 text-gold-300">
                    <Check className="size-3" strokeWidth={2.75} aria-hidden />
                  </span>
                  {feature}
                </li>
              ))}
          </ul>

          <dl className="mt-7 border-t border-white/15 pt-6">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-[1rem] font-semibold">{copy.totalToday}</dt>
              <dd dir="ltr" className={cn(SERIF, "text-[2rem] font-light tracking-[-0.03em] tabular-nums text-gold-300")}>{formattedPrice}</dd>
            </div>
          </dl>

          <ul className="mt-6 space-y-3 border-t border-white/15 pt-6">
            {[
              { icon: ShieldCheck, text: copy.secureProcessed },
              { icon: Lock, text: copy.cardHandled },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-[0.875rem] leading-6 text-teal-100">
                <Icon className="mt-0.5 size-4 shrink-0 text-gold-300" aria-hidden />
                <span className="min-w-0">{text}</span>
              </li>
            ))}
          </ul>
        </motion.aside>

        {/* Payment form */}
        <motion.section
          aria-labelledby="payment-details-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          className="rounded-[2rem] border border-line bg-white p-6 shadow-[var(--shadow-soft)] sm:p-10"
        >
          <div className="mb-8 flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <CreditCard className="size-5" strokeWidth={1.5} aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 id="payment-details-title" className={cn(DISPLAY_S, "text-[clamp(1.5rem,1vw+1.2rem,2rem)] text-ink")}>{copy.detailsTitle}</h2>
              <p className="mt-1.5 text-[0.9375rem] leading-7 text-ink-soft">{copy.detailsBody}</p>
            </div>
          </div>

          <div className="mb-10">
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
            <div role="alert" className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3.5">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-700" aria-hidden />
              <p className="text-[0.9375rem] leading-6 text-rose-700">{error}</p>
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

              <Button
                type="submit"
                variant="default"
                size="lg"
                aria-busy={isProcessing}
                className="group relative min-h-14 w-full overflow-hidden bg-ink text-white shadow-[0_18px_36px_-16px_rgb(17_76_97/0.75)] hover:bg-teal-900"
              >
                {/* Warmth rises from the bottom edge on hover */}
                <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-gold/25 transition-transform duration-500 ease-out-soft group-hover:scale-y-100" />
                <span className="relative flex items-center gap-2.5">
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
                </span>
              </Button>
              <p className="text-center text-[0.875rem] text-ink-soft">{copy.cancelBefore}</p>
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
    <div className="mx-auto mb-12 w-full max-w-6xl sm:mb-16">
      <SectionHeader variant="editorial" id="payment-title" as="h1" eyebrow={copy.eyebrow} titleA={copy.title} intro={copy.subtitle} />
    </div>
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
      <ul className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[0.875rem] text-ink-soft">
        {copy.trust.map((item) => (
          <li key={item} className="inline-flex items-center gap-1.5">
            <Check className="size-4 text-sage-700" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </CheckoutLayout>
  );
}
