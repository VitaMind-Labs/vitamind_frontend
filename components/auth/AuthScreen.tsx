"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail, Phone, Shield, Brain, Heart, UserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { getStoredDiagnosticSessionId } from "@/lib/diagnosticSession";
import { setUser } from "@/lib/storage";

// ─── TYPES & CONSTANTES ───────────────────────────────────────────────────────
type AuthMode = "signin" | "signup";
type FormValues = { nickname: string; email: string; phone: string; password: string; confirmPassword: string };

const T = {
  titleSignIn: "Welcome back", titleSignUp: "Create your sanctuary",
  subtitleSignIn: "Sign in to continue your guided diagnostic journey.",
  subtitleSignUp: "Build your account and start a calmer, more personalized experience.",
  nickname: "Nickname", nicknamePlaceholder: "Choose your nickname",
  email: "Email", emailPlaceholder: "hello@example.com",
  phone: "Phone number", phonePlaceholder: "+1 555 123 4567",
  password: "Password", passwordPlaceholder: "••••••••",
  confirmPassword: "Confirm password", confirmPasswordPlaceholder: "••••••••",
  signInButton: "Enter VitaMind", signUpButton: "Create my account",
  legal: "By continuing, you agree to use this experience responsibly.",
  switchToSignIn: "Already have an account?", switchToSignUp: "Need an account?",
  switchSignInLink: "Sign in", switchSignUpLink: "Sign up",
  errors: { nickname: "Nickname is required.", email: "Please enter a valid email address.", phone: "Please enter a valid phone number.", password: "Password must contain at least 8 characters.", confirmPassword: "Passwords do not match." },
};

const TRUST = [{ icon: Shield, label: "HIPAA & GDPR compliant" }, { icon: Brain, label: "AI-powered insights" }, { icon: Heart, label: "Human-centered care" }];
const FV = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } } };
const CV = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };

// ─── SOUS-COMPOSANTS ──────────────────────────────────────────────────────────
function AuthInput({ icon: Icon, right, ...p }: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ElementType; right?: React.ReactNode }) {
  return (
    <div className="relative group">
      <Icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-all duration-200 group-focus-within:text-[#518591] group-focus-within:scale-110" style={{ color: "#B0BEC5" }} />
      <input {...p} className="w-full rounded-xl py-3 pl-11 pr-11 font-body text-[15px] outline-none transition-all duration-300 placeholder:text-[#B0BEC5]"
        style={{ border: "1.5px solid rgba(81,133,145,0.15)", background: "rgba(255,255,255,0.85)", color: "#2c3e3b", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.02)" }}
        onFocus={e => { e.currentTarget.style.border = "1.5px solid rgba(81,133,145,0.55)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(81,133,145,0.10)"; p.onFocus?.(e); }}
        onBlur={e => { e.currentTarget.style.border = "1.5px solid rgba(81,133,145,0.15)"; e.currentTarget.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.02)"; p.onBlur?.(e); }} />
      {right && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{right}</div>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div variants={FV} className="flex flex-col gap-1.5">
      <label className="font-body text-[13px] font-semibold" style={{ color: "rgba(44,62,59,0.72)" }}>{label}</label>
      {children}
    </motion.div>
  );
}

function EyeBtn({ show, toggle }: { show: boolean; toggle: () => void }) {
  return <button type="button" onClick={toggle} className="hover:scale-110 transition-transform" style={{ color: "#B0BEC5" }}>{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>;
}



// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export function AuthScreen({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { dictionary, direction } = useLanguage();
  const auth = (dictionary.auth ?? T) as typeof T;
  const isSignUp = mode === "signup";

  const [values, setValues] = useState<FormValues>({ nickname: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const set = (f: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => setValues(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError("");
    if (isSignUp && !values.nickname.trim()) return setError(auth.errors.nickname);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return setError(auth.errors.email);
    if (isSignUp && !/^[+\d][\d\s()-]{7,}$/.test(values.phone.trim())) return setError(auth.errors.phone);
    if (values.password.length < 8) return setError(auth.errors.password);
    if (isSignUp && values.password !== values.confirmPassword) return setError(auth.errors.confirmPassword);
    startTransition(() => {
      (async () => {
        const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
        const sid = searchParams.get("sessionId") || getStoredDiagnosticSessionId();
        try {
          const res = await fetch(`${base.replace(/\/$/, "")}${isSignUp ? "/auth/register" : "/auth/login"}`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(isSignUp ? { nickname: values.nickname.trim(), email: values.email.trim(), phone: values.phone.trim(), password: values.password, diagnosticSessionId: sid } : { email: values.email.trim(), password: values.password }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message ?? data.error ?? "Authentication failed");
          if (data.user) setUser({ id: data.user.id ?? "", fullName: data.user.nickname ?? values.email.trim(), email: values.email.trim(), password: "", disease: "ADHD", createdAt: new Date().toISOString() });
          if (data.access_token) localStorage.setItem("vitamind_token", data.access_token);
          if (data.refresh_token) localStorage.setItem("vitamind_refresh_token", data.refresh_token);
          if (data.user) localStorage.setItem("vitamind_user", JSON.stringify(data.user));
          const redirect = searchParams.get("redirect");
          const uid = data?.user?.id;

          router.push(
            uid
              ? redirect?.startsWith("/dashboard")
                ? `/dashboard/${uid}/overview`
                : redirect || `/dashboard/${uid}/overview`
              : "/"
          );
        } catch (err) { setError(err instanceof Error ? err.message : "Authentication failed"); }
      })();
    });
  };

  return (
    <div
      dir={direction}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f9fb] px-4 py-10"
    >
      {/* BACKGROUND */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* glow top */}
        <div
          className="absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-[140px]"
          style={{
            background: "rgba(81,133,145,0.10)",
          }}
        />

        {/* glow bottom */}
        <div
          className="absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full blur-[130px]"
          style={{
            background: "rgba(227,176,28,0.07)",
          }}
        />

        {/* texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, #000 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      {/* FORM CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 w-full max-w-[540px]"
      >

        {/* CARD */}
        <div
          className="relative overflow-hidden rounded-[34px] border p-7 sm:p-10"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(255,255,255,0.94), rgba(255,255,255,0.82))",
            borderColor: "rgba(81,133,145,0.10)",
            backdropFilter: "blur(28px)",
            boxShadow:
              "0 20px 70px rgba(15,23,42,0.08)",
          }}
        >
          {/* internal glow */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at top right, rgba(81,133,145,0.08), transparent 30%)",
            }}
          />

          <div className="relative z-10">
            {/* HEADER */}
            <div className="mb-8 text-center">
              <span
                className="mb-3 block font-body text-[11px] font-semibold uppercase tracking-[0.32em]"
                style={{
                  color: "#518591",
                }}
              >
                {isSignUp
                  ? "Create Account"
                  : "Welcome Back"}
              </span>

              <h1
                className="font-display font-light tracking-[-0.05em]"
                style={{
                  fontSize: "clamp(34px,4vw,48px)",
                  lineHeight: 1,
                  color: "#0f172a",
                }}
              >
                {isSignUp
                  ? auth.titleSignUp
                  : auth.titleSignIn}
              </h1>

              <p
                className="mx-auto mt-4 max-w-[360px] font-body text-[14px] leading-[1.8]"
                style={{
                  color: "rgba(44,62,59,0.58)",
                }}
              >
                {isSignUp
                  ? auth.subtitleSignUp
                  : auth.subtitleSignIn}
              </p>
            </div>

            {/* FORM */}
            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                onSubmit={handleSubmit}
                variants={CV}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-5"
              >
                {/* ERROR */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                      }}
                      className="flex items-start gap-3 rounded-2xl border p-4"
                      style={{
                        borderColor:
                          "rgba(239,68,68,0.15)",
                        background:
                          "rgba(254,242,242,0.70)",
                      }}
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />

                      <p className="font-body text-[13px] leading-[1.7] text-red-700">
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isSignUp && (
                  <Field label={auth.nickname}>
                    <AuthInput
                      icon={UserRound}
                      type="text"
                      value={values.nickname}
                      onChange={set("nickname")}
                      placeholder={
                        auth.nicknamePlaceholder
                      }
                      autoComplete="nickname"
                    />
                  </Field>
                )}

                <Field label={auth.email}>
                  <AuthInput
                    icon={Mail}
                    type="email"
                    value={values.email}
                    onChange={set("email")}
                    placeholder={
                      auth.emailPlaceholder
                    }
                    autoComplete="email"
                  />
                </Field>

                {isSignUp && (
                  <Field label={auth.phone}>
                    <AuthInput
                      icon={Phone}
                      type="tel"
                      value={values.phone}
                      onChange={set("phone")}
                      placeholder={
                        auth.phonePlaceholder
                      }
                      autoComplete="tel"
                    />
                  </Field>
                )}

                <Field label={auth.password}>
                  <AuthInput
                    icon={Lock}
                    type={
                      showPwd ? "text" : "password"
                    }
                    value={values.password}
                    onChange={set("password")}
                    placeholder={
                      auth.passwordPlaceholder
                    }
                    autoComplete={
                      isSignUp
                        ? "new-password"
                        : "current-password"
                    }
                    right={
                      <EyeBtn
                        show={showPwd}
                        toggle={() =>
                          setShowPwd((p) => !p)
                        }
                      />
                    }
                  />
                </Field>

                {isSignUp && (
                  <Field
                    label={auth.confirmPassword}
                  >
                    <AuthInput
                      icon={Lock}
                      type={
                        showConfirm
                          ? "text"
                          : "password"
                      }
                      value={values.confirmPassword}
                      onChange={set(
                        "confirmPassword"
                      )}
                      placeholder={
                        auth.confirmPasswordPlaceholder
                      }
                      autoComplete="new-password"
                      right={
                        <EyeBtn
                          show={showConfirm}
                          toggle={() =>
                            setShowConfirm(
                              (p) => !p
                            )
                          }
                        />
                      }
                    />
                  </Field>
                )}

                {/* CTA */}
                <motion.button
                  variants={FV}
                  type="submit"
                  disabled={isPending}
                  whileHover={
                    isPending
                      ? {}
                      : { scale: 1.015 }
                  }
                  whileTap={
                    isPending
                      ? {}
                      : { scale: 0.985 }
                  }
                  className="group relative mt-2 flex h-[58px] w-full items-center justify-center gap-3 overflow-hidden rounded-2xl font-body text-[15px] font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #518591 0%, #2c3e3b 55%, #e3b01c 100%)",
                    boxShadow:
                      "0 16px 40px rgba(81,133,145,0.20)",
                    opacity: isPending ? 0.75 : 1,
                  }}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {isPending ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      {isSignUp
                        ? auth.signUpButton
                        : auth.signInButton}

                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>

                {/* LEGAL */}
                <motion.p
                  variants={FV}
                  className="pt-1 text-center font-body text-[12px] leading-[1.8]"
                  style={{
                    color:
                      "rgba(44,62,59,0.42)",
                  }}
                >
                  {auth.legal}
                </motion.p>
              </motion.form>
            </AnimatePresence>

            {/* FOOTER */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center font-body text-[14px]"
              style={{
                color: "rgba(44,62,59,0.55)",
              }}
            >
              {isSignUp
                ? auth.switchToSignIn
                : auth.switchToSignUp}{" "}
              <Link
                href={
                  isSignUp
                    ? "/auth/signin"
                    : "/auth/signup"
                }
                className="font-semibold underline underline-offset-4 transition-all duration-300 hover:text-[#e3b01c]"
                style={{
                  color: "#518591",
                }}
              >
                {isSignUp
                  ? auth.switchSignInLink
                  : auth.switchSignUpLink}
              </Link>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}