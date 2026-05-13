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

// Textes par défaut en anglais
const defaultAuthTexts = {
  helperTitle: "PREMIUM EXPERIENCE",
  titleSignIn: "Welcome back",
  titleSignUp: "Create your sanctuary",
  subtitleSignIn: "Sign in to continue your guided diagnostic journey.",
  subtitleSignUp: "Build your account and start a calmer, more personalized experience.",
  nickname: "Nickname",
  nicknamePlaceholder: "Choose your nickname",
  email: "Email",
  emailPlaceholder: "hello@example.com",
  phone: "Phone number",
  phonePlaceholder: "+1 555 123 4567",
  password: "Password",
  passwordPlaceholder: "••••••••",
  confirmPassword: "Confirm password",
  confirmPasswordPlaceholder: "••••••••",
  signInButton: "Enter VitaMind",
  signUpButton: "Create my account",
  legal: "By continuing, you agree to use this experience responsibly and seek professional care when needed.",
  switchToSignIn: "Already have an account?",
  switchToSignUp: "Need an account?",
  switchSignInLink: "Sign in",
  switchSignUpLink: "Sign up",
  errors: {
    nickname: "Nickname is required.",
    email: "Please enter a valid email address.",
    phone: "Please enter a valid phone number.",
    password: "Password must contain at least 8 characters.",
    confirmPassword: "Passwords do not match.",
  },
  highlights: [
    "Nickname-based access",
    "Lightweight onboarding",
    "Diagnostic session ready",
  ],
};

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { dictionary, direction } = useLanguage();
  const { auth = defaultAuthTexts, brand } = dictionary;
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
      setError(auth.errors?.nickname || "Veuillez entrer un pseudo valide");
      return;
    }

    if (isSignUp && !validateEmail(values.email)) {
      setError(auth.errors?.email || "Veuillez entrer une adresse email valide");
      return;
    }

    if (isSignUp && !validatePhone(values.phone)) {
      setError(auth.errors?.phone || "Veuillez entrer un numéro de téléphone valide");
      return;
    }

    if (values.password.trim().length < 8) {
      setError(auth.errors?.password || "Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (isSignUp && values.password !== values.confirmPassword) {
      setError(auth.errors?.confirmPassword || "Les mots de passe ne correspondent pas");
      return;
    }

    startTransition(() => {
      router.push(isSignUp ? "/subscription" : `/diagnostic?chatId=${createChatId()}`);
    });
  }

  const fields = [
    {
      key: "nickname" as const,
      label: auth.nickname || defaultAuthTexts.nickname,
      placeholder: auth.nicknamePlaceholder || defaultAuthTexts.nicknamePlaceholder,
      icon: UserRound,
      type: "text",
    },
    ...(isSignUp
      ? [
        {
          key: "email" as const,
          label: auth.email || defaultAuthTexts.email,
          placeholder: auth.emailPlaceholder || defaultAuthTexts.emailPlaceholder,
          icon: Mail,
          type: "email",
        },
        {
          key: "phone" as const,
          label: auth.phone || defaultAuthTexts.phone,
          placeholder: auth.phonePlaceholder || defaultAuthTexts.phonePlaceholder,
          icon: Phone,
          type: "tel",
        },
      ]
      : []),
    {
      key: "password" as const,
      label: auth.password || defaultAuthTexts.password,
      placeholder: auth.passwordPlaceholder || defaultAuthTexts.passwordPlaceholder,
      icon: Lock,
      type: showPassword ? "text" : "password",
      toggle: () => setShowPassword((current) => !current),
      show: showPassword,
    },
    ...(isSignUp
      ? [
        {
          key: "confirmPassword" as const,
          label: auth.confirmPassword || defaultAuthTexts.confirmPassword,
          placeholder: auth.confirmPasswordPlaceholder || defaultAuthTexts.confirmPasswordPlaceholder,
          icon: Lock,
          type: showConfirmPassword ? "text" : "password",
          toggle: () => setShowConfirmPassword((current) => !current),
          show: showConfirmPassword,
        },
      ]
      : []),
  ];

  const highlights = auth.highlights || defaultAuthTexts.highlights;

  return (
    <div
      dir={direction}
      className="relative h-full min-h-screen overflow-hidden bg-[#F0F0F0] text-[#2c3e3b]"
    >
      {/* Modern abstract background with brand colors */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Deep Teal gradient orb */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute left-[-10rem] top-[6rem] h-[34rem] w-[34rem] rounded-full bg-[#518591]/20 blur-[120px]"
        />
        {/* Vital Gold gradient orb */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="absolute right-[-8rem] top-[18rem] h-[30rem] w-[30rem] rounded-full bg-[#e3b01c]/15 blur-[130px]"
        />
        {/* Soft Teal accent orb */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
          className="absolute bottom-[10%] left-[15%] h-[26rem] w-[26rem] rounded-full bg-[#E0E0E0]/60 blur-[160px]"
        />
        {/* Muted Cyan subtle layer */}
        <div className="absolute right-[20%] top-[40%] h-[20rem] w-[20rem] rounded-full bg-[#B0B0B0]/20 blur-[140px]" />

        {/* Refined gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(81,133,145,0.08),transparent_40%),radial-gradient(circle_at_80%_15%,rgba(227,176,28,0.06),transparent_30%)]" />

        {/* Subtle grain texture for premium feel */}
        <div className="grain-overlay absolute inset-0 opacity-[0.03]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[98rem] px-6 pb-16 pt-20 sm:px-10 lg:px-16">
        <div className="mt-16 grid gap-16 lg:grid-cols-[1.05fr_520px] lg:items-start">
          {/* Left column - editorial content with brand storytelling */}
          <section className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#518591]/20 bg-[#F0F0F0]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#518591] shadow-sm backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                {auth.helperTitle || defaultAuthTexts.helperTitle}
              </div>

              <h1 className="mt-10 text-[clamp(48px,7vw,82px)] font-semibold leading-[0.92] tracking-[-0.06em] text-[#2c3e3b]">
                {isSignUp
                  ? (auth.titleSignUp || defaultAuthTexts.titleSignUp)
                  : (auth.titleSignIn || defaultAuthTexts.titleSignIn)}
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#2c3e3b]/60">
                {isSignUp
                  ? (auth.subtitleSignUp || defaultAuthTexts.subtitleSignUp)
                  : (auth.subtitleSignIn || defaultAuthTexts.subtitleSignIn)}
              </p>

              <div className="mt-12 grid gap-4">
                {highlights.map((item: string, idx: number) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.08 }}
                    whileHover={{ x: 4 }}
                    className="group flex items-center gap-4 rounded-2xl border border-[#E0E0E0] bg-white/60 p-5 backdrop-blur-sm transition-all hover:border-[#518591]/30 hover:bg-white/80"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#518591] to-[#3d6a73] text-white shadow-sm">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium text-[#2c3e3b]/80 group-hover:text-[#2c3e3b]">
                      {item}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Right column - auth form panel */}
          <section className="flex items-start justify-center pt-4">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl rounded-3xl border border-[#E0E0E0] bg-white/90 p-8 shadow-2xl shadow-[#518591]/5 backdrop-blur-sm sm:p-10"
            >
              <div className="mb-8 text-center sm:text-left">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-semibold tracking-[-0.05em] text-[#2c3e3b]"
                >
                  {isSignUp
                    ? (auth.titleSignUp || defaultAuthTexts.titleSignUp)
                    : (auth.titleSignIn || defaultAuthTexts.titleSignIn)}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="mt-3 text-base leading-7 text-[#2c3e3b]/50"
                >
                  {isSignUp
                    ? (auth.subtitleSignUp || defaultAuthTexts.subtitleSignUp)
                    : (auth.subtitleSignIn || defaultAuthTexts.subtitleSignIn)}
                </motion.p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3 rounded-xl border border-[#e3b01c]/30 bg-[#e3b01c]/10 px-4 py-3 text-sm text-[#c49b0f] backdrop-blur-sm"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p className="flex-1">{error}</p>
                  </motion.div>
                ) : null}

                {fields.map((field, index) => {
                  const Icon = field.icon;

                  return (
                    <motion.div
                      key={field.key}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-[#2c3e3b]/70">
                          {field.label}
                        </span>
                        <div className="relative">
                          <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0B0B0] transition-colors group-focus-within:text-[#518591]" />
                          <input
                            type={field.type}
                            value={values[field.key]}
                            onChange={(event) => updateValue(field.key, event.target.value)}
                            placeholder={field.placeholder}
                            className="w-full rounded-xl border border-[#E0E0E0] bg-white/80 py-3.5 pl-11 pr-12 text-base text-[#2c3e3b] outline-none transition-all placeholder:text-[#B0B0B0] focus:border-[#518591] focus:ring-2 focus:ring-[#518591]/20 focus:bg-white"
                          />
                          {field.toggle ? (
                            <button
                              type="button"
                              onClick={field.toggle}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B0B0B0] transition hover:text-[#518591]"
                              aria-label={field.show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            >
                              {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          ) : null}
                        </div>
                      </label>
                    </motion.div>
                  );
                })}

                <motion.button
                  type="submit"
                  disabled={isPending}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="group relative mt-4 inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#518591] to-[#3d6a73] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#518591]/20 transition-all hover:shadow-xl hover:shadow-[#518591]/30 disabled:opacity-70"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#e3b01c]/0 via-[#e3b01c]/20 to-[#e3b01c]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {isPending ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      {isSignUp
                        ? (auth.signUpButton || defaultAuthTexts.signUpButton)
                        : (auth.signInButton || defaultAuthTexts.signInButton)}
                      <ArrowRight
                        className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${direction === "rtl" ? "rotate-180" : ""}`}
                      />
                    </>
                  )}
                </motion.button>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="pt-2 text-center text-xs leading-relaxed text-[#B0B0B0]"
                >
                  {auth.legal || defaultAuthTexts.legal}
                </motion.p>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 flex items-center justify-center gap-2 border-t border-[#E0E0E0] pt-6 text-sm text-[#2c3e3b]/60"
              >
                <span>{isSignUp
                  ? (auth.switchToSignIn || defaultAuthTexts.switchToSignIn)
                  : (auth.switchToSignUp || defaultAuthTexts.switchToSignUp)}</span>
                <Link
                  href={isSignUp ? "/auth/signin" : "/auth/signup"}
                  className="font-semibold text-[#518591] transition-all hover:text-[#e3b01c] hover:underline underline-offset-4"
                >
                  {isSignUp
                    ? (auth.switchSignInLink || defaultAuthTexts.switchSignInLink)
                    : (auth.switchSignUpLink || defaultAuthTexts.switchSignUpLink)}
                </Link>
              </motion.div>
            </motion.div>
          </section>
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