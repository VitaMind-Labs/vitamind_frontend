"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { createChatId } from "@/lib/chat";

type AuthMode = "signin" | "signup";

type FormValues = {
  nickname: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const initialValues: FormValues = {
  nickname: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { dictionary, direction } = useLanguage();
  const { auth, brand } = dictionary;
  const isSignUp = mode === "signup";

  const [values, setValues] = useState<FormValues>(initialValues);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function updateValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone: string) {
    return /^[+\d][\d\s()-]{7,}$/.test(phone.trim());
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!values.nickname.trim()) {
      setError(auth.errors.nickname);
      return;
    }

    if (isSignUp && !validateEmail(values.email)) {
      setError(auth.errors.email);
      return;
    }

    if (isSignUp && !validatePhone(values.phone)) {
      setError(auth.errors.phone);
      return;
    }

    if (values.password.trim().length < 8) {
      setError(auth.errors.password);
      return;
    }

    if (isSignUp && values.password !== values.confirmPassword) {
      setError(auth.errors.confirmPassword);
      return;
    }

    startTransition(() => {
      router.push(isSignUp ? "/subscription" : `/diagnostic?chatId=${createChatId()}`);
    });
  }

  const fields = [
    {
      key: "nickname" as const,
      label: auth.nickname,
      placeholder: auth.nicknamePlaceholder,
      icon: UserRound,
      type: "text",
    },
    ...(isSignUp
      ? [
        {
          key: "email" as const,
          label: auth.email,
          placeholder: auth.emailPlaceholder,
          icon: Mail,
          type: "email",
        },
        {
          key: "phone" as const,
          label: auth.phone,
          placeholder: auth.phonePlaceholder,
          icon: Phone,
          type: "tel",
        },
      ]
      : []),
    {
      key: "password" as const,
      label: auth.password,
      placeholder: auth.passwordPlaceholder,
      icon: Lock,
      type: showPassword ? "text" : "password",
      toggle: () => setShowPassword((current) => !current),
      show: showPassword,
    },
    ...(isSignUp
      ? [
        {
          key: "confirmPassword" as const,
          label: auth.confirmPassword,
          placeholder: auth.confirmPasswordPlaceholder,
          icon: Lock,
          type: showConfirmPassword ? "text" : "password",
          toggle: () => setShowConfirmPassword((current) => !current),
          show: showConfirmPassword,
        },
      ]
      : []),
  ];

  return (  
    <div
      dir={direction}
      className="relative h-full min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]"
    >
      {/* Ambient atmospheric orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[-10rem] top-[6rem] h-[34rem] w-[34rem] rounded-full bg-[#dceccb]/60 blur-[120px]" />
        <div className="absolute right-[-8rem] top-[18rem] h-[30rem] w-[30rem] rounded-full bg-[#dfe8f5]/75 blur-[130px]" />
        <div className="absolute left-[20%] top-[45%] h-[26rem] w-[26rem] rounded-full bg-white/60 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(183,216,156,0.15),transparent_25%),radial-gradient(circle_at_80%_15%,rgba(223,232,245,0.6),transparent_20%),linear-gradient(180deg,#fafaf8_0%,#f6f5ef_48%,#fafaf8_100%)]" />
        <div className="grain-overlay absolute inset-0 opacity-[0.06]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[98rem] px-6 pb-16 pt-20 sm:px-10 lg:px-16">
        {/* Main content */}
        <div className="mt-16 grid gap-16 lg:grid-cols-[1.05fr_520px] lg:items-start">
          {/* Left column - editorial content */}
          <section className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-dark shadow-sm backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                {auth.helperTitle}
              </div>

              <h1 className="mt-10 text-[clamp(48px,7vw,82px)] font-semibold leading-[0.92] tracking-[-0.06em] text-black">
                {isSignUp ? auth.titleSignUp : auth.titleSignIn}
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-black/55">
                {isSignUp ? auth.subtitleSignUp : auth.subtitleSignIn}
              </p>

              <div className="mt-12 grid gap-4">
                {auth.highlights.map((item) => (
                  <div
                    key={item}
                    className="card-cinema flex items-center gap-4 p-5"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-black text-white">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium text-black/75">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Right column - auth form panel */}
          <section className="flex items-start justify-center pt-4">
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="card-cinema w-full max-w-xl p-8 sm:p-10"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-semibold tracking-[-0.05em] text-black">
                  {isSignUp ? auth.titleSignUp : auth.titleSignIn}
                </h2>
                <p className="mt-3 text-base leading-7 text-black/50">
                  {isSignUp ? auth.subtitleSignUp : auth.subtitleSignIn}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 rounded-2xl border border-red-200/60 bg-red-50/80 px-4 py-3 text-sm text-red-700"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                ) : null}

                {fields.map((field, index) => {
                  const Icon = field.icon;

                  return (
                    <motion.label
                      key={field.key}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + index * 0.05 }}
                      className="block"
                    >
                      <span className="mb-2 block text-sm font-semibold text-black/75">
                        {field.label}
                      </span>
                      <span className="relative block">
                        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/30" />
                        <input
                          type={field.type}
                          value={values[field.key]}
                          onChange={(event) => updateValue(field.key, event.target.value)}
                          placeholder={field.placeholder}
                          className="w-full rounded-[20px] border border-black/8 bg-[#fdfdfc] py-3.5 pl-11 pr-12 text-base text-foreground outline-none transition focus:border-black/20 focus:ring-4 focus:ring-black/6"
                        />
                        {field.toggle ? (
                          <button
                            type="button"
                            onClick={field.toggle}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 transition hover:text-black/60"
                            aria-label={field.show ? "Hide password" : "Show password"}
                          >
                            {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        ) : null}
                      </span>
                    </motion.label>
                  );
                })}

                <motion.button
                  type="submit"
                  disabled={isPending}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-[24px] bg-black px-6 py-4 text-base font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-70"
                >
                  {isPending ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      {isSignUp ? auth.signUpButton : auth.signInButton}
                      <ArrowRight className={`h-4 w-4 ${direction === "rtl" ? "rotate-180" : ""}`} />
                    </>
                  )}
                </motion.button>

                <p className="pt-2 text-xs leading-relaxed text-black/40">
                  {auth.legal}
                </p>
              </form>

              <div className="mt-8 flex items-center justify-center gap-2 border-t border-black/8 pt-6 text-sm text-black/55">
                <span>{isSignUp ? auth.switchToSignIn : auth.switchToSignUp}</span>
                <Link
                  href={isSignUp ? "/auth/signin" : "/auth/signup"}
                  className="font-semibold text-black underline underline-offset-4"
                >
                  {isSignUp ? auth.switchSignInLink : auth.switchSignUpLink}
                </Link>
              </div>
            </motion.div>
          </section>
        </div>

        {/* Footer - matching home page */}
        {/* <section className="relative mt-28 overflow-hidden rounded-[2.8rem] border border-black/8 bg-black px-8 py-14 text-[#fafaf8] shadow-[0_30px_120px_rgba(17,17,17,0.16)] sm:px-10 lg:px-14 lg:py-18">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(183,216,156,0.2),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(223,232,245,0.14),transparent_30%)]" />
          <div className="relative">
            <h2 className="max-w-4xl text-5xl font-semibold leading-[0.88] tracking-[-0.085em] text-white sm:text-6xl lg:text-[5rem]">
              {isSignUp ? "Ready to begin." : "Welcome back."}
              <span className="block text-white/55">Secure, calm, and private.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/66">
              {brand} is an immersive therapeutic experience. Every interaction
              is designed for psychological safety and emotional calm.
            </p>

            <div className="relative mt-10 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:flex-wrap">
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Link
                  href="/diagnostic"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#fafaf8] px-7 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-0.5"
                >
                  {dictionary.nav.diagnostic}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Link
                  href={isSignUp ? "/auth/signin" : "/auth/signup"}
                  className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-7 py-3.5 text-sm font-medium text-white/84 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  {isSignUp ? auth.switchSignInLink : auth.switchSignUpLink}
                </Link>
              </motion.div>

              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 px-5 py-3.5 text-sm text-white/55">
                <ShieldCheck className="h-4 w-4" />
                Secure, calm, and privacy-first
              </div>
            </div>
          </div>
        </section> */}
      </div>
    </div>
  );
}
