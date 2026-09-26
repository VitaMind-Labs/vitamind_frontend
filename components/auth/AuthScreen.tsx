"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { getStoredDiagnosticSessionId } from "@/features/diagnostic";
import { setUser } from "@/lib/storage/storage";
import { Button } from "@/components/ui/button";
import { FormField, IconInput } from "@/components/shared/FormField";
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

type AuthMode = "signin" | "signup";
type FormValues = { nickname: string; email: string; phone: string; password: string; confirmPassword: string };
type FieldName = keyof FormValues;

function VisibilityToggle({ show, toggle, label }: { show: boolean; toggle: () => void; label: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      aria-pressed={show}
      onClick={toggle}
      className="h-9 w-9 min-h-9 rounded-full text-ink-subtle hover:bg-teal-50 hover:text-teal-700"
    >
      {show ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
    </Button>
  );
}

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { dictionary, direction } = useLanguage();
  const auth = dictionary.auth;
  const isSignUp = mode === "signup";

  const [values, setValues] = useState<FormValues>({ nickname: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<FieldName | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = (f: FieldName) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(p => ({ ...p, [f]: e.target.value }));
    if (errorField === f) { setError(""); setErrorField(null); }
  };
  const fail = (field: FieldName, message: string) => { setErrorField(field); setError(message); };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(""); setErrorField(null);
    if (isSignUp && !values.nickname.trim()) return fail("nickname", auth.errors.nickname);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return fail("email", auth.errors.email);
    if (isSignUp && !/^[+\d][\d\s()-]{7,}$/.test(values.phone.trim())) return fail("phone", auth.errors.phone);
    if (values.password.length < 8) return fail("password", auth.errors.password);
    if (isSignUp && values.password !== values.confirmPassword) return fail("confirmPassword", auth.errors.confirmPassword);

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
          router.push(redirect?.startsWith("/dashboard") ? redirect : "/dashboard");
        } catch (err) { setError(err instanceof Error ? err.message : "Authentication failed"); }
      })();
    });
  };

  const fieldError = (field: FieldName) => (errorField === field ? error : null);
  const formError = error && !errorField ? error : "";
  const switchHref = isSignUp ? "/auth/signin" : "/auth/signup";
  const switchPrompt = isSignUp ? auth.switchToSignIn : auth.switchToSignUp;
  const switchLink = isSignUp ? auth.switchSignInLink : auth.switchSignUpLink;

  return (
    <motion.div
      dir={direction}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className="surface-glass relative flex w-full flex-col items-center px-5 py-8 sm:px-8 sm:py-10"
    >
      <div className="text-center">
        <p className="home-eyebrow home-eyebrow-pill">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-600" aria-hidden />
          {auth.badge}
        </p>
        <h1 className="home-heading mt-5 text-[clamp(1.75rem,1.4vw+1.3rem,2.25rem)] font-light">
          {isSignUp ? auth.titleSignUpA : auth.titleSignInA}{" "}
          <span className="home-heading-accent font-normal">{isSignUp ? auth.titleSignUpB : auth.titleSignInB}</span>
        </h1>
        <p className="mt-3 text-[0.9375rem] leading-6 text-ink-muted">
          {isSignUp ? (
            auth.subtitleSignUp
          ) : (
            <>
              {auth.subtitleSignIn}{" "}
              <Link href="/auth/signup" className="rounded-md font-semibold text-teal-700 underline-offset-4 hover:underline">
                {auth.subtitleSignInLink}
              </Link>
            </>
          )}
        </p>
      </div>

      {/* ── SERVER ERROR ─────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {formError && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="w-full overflow-hidden"
          >
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-100 bg-rose-50 px-3.5 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" aria-hidden />
              <p className="text-[0.8125rem] leading-5 text-rose-700">{formError}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FORM ─────────────────────────────────────────────────────── */}
      <motion.form
        key={mode}
        noValidate
        onSubmit={handleSubmit}
        variants={stagger(0.05, 0.08)}
        initial="hidden"
        animate="show"
        className="mt-8 flex w-full flex-col gap-4"
        aria-busy={isPending}
      >
        {isSignUp && (
          <motion.div variants={fadeUp(0, 8)}>
            <FormField id="auth-nickname" label={auth.nickname} error={fieldError("nickname")} compact>
              <IconInput
                id="auth-nickname"
                icon={UserRound}
                type="text"
                value={values.nickname}
                onChange={set("nickname")}
                placeholder={auth.nicknamePlaceholder}
                autoComplete="nickname"
                invalid={errorField === "nickname"}
              />
            </FormField>
          </motion.div>
        )}

        <motion.div variants={fadeUp(0, 8)}>
          <FormField id="auth-email" label={auth.email} error={fieldError("email")} compact>
            <IconInput
              id="auth-email"
              icon={Mail}
              type="email"
              inputMode="email"
              dir="ltr"
              value={values.email}
              onChange={set("email")}
              placeholder={auth.emailPlaceholder}
              autoComplete="email"
              invalid={errorField === "email"}
            />
          </FormField>
        </motion.div>

        {isSignUp && (
          <motion.div variants={fadeUp(0, 8)}>
            <FormField id="auth-phone" label={auth.phone} error={fieldError("phone")} compact>
              <IconInput
                id="auth-phone"
                icon={Phone}
                type="tel"
                inputMode="tel"
                dir="ltr"
                value={values.phone}
                onChange={set("phone")}
                placeholder={auth.phonePlaceholder}
                autoComplete="tel"
                invalid={errorField === "phone"}
              />
            </FormField>
          </motion.div>
        )}

        <motion.div variants={fadeUp(0, 8)}>
          <FormField id="auth-password" label={auth.password} error={fieldError("password")} compact>
            <IconInput
              id="auth-password"
              icon={Lock}
              type={showPwd ? "text" : "password"}
              value={values.password}
              onChange={set("password")}
              placeholder={auth.passwordPlaceholder}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              invalid={errorField === "password"}
              trailing={<VisibilityToggle show={showPwd} toggle={() => setShowPwd((p) => !p)} label={showPwd ? auth.hidePassword : auth.showPassword} />}
            />
          </FormField>
        </motion.div>

        {isSignUp && (
          <motion.div variants={fadeUp(0, 8)}>
            <FormField id="auth-confirm-password" label={auth.confirmPassword} error={fieldError("confirmPassword")} compact>
              <IconInput
                id="auth-confirm-password"
                icon={Lock}
                type={showConfirm ? "text" : "password"}
                value={values.confirmPassword}
                onChange={set("confirmPassword")}
                placeholder={auth.confirmPasswordPlaceholder}
                autoComplete="new-password"
                invalid={errorField === "confirmPassword"}
                trailing={<VisibilityToggle show={showConfirm} toggle={() => setShowConfirm((p) => !p)} label={showConfirm ? auth.hideConfirm : auth.showConfirm} />}
              />
            </FormField>
          </motion.div>
        )}

        <motion.div variants={fadeUp(0, 8)} className="pt-2">
          <Button type="submit" variant="auth" size="lg" disabled={isPending} aria-busy={isPending}>
            {isPending ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                <span>{auth.processing}</span>
              </>
            ) : (
              <span>{isSignUp ? auth.signUpButton : auth.signInButton}</span>
            )}
          </Button>
        </motion.div>

        {!isSignUp && (
          <>
            <motion.div variants={fadeUp(0, 8)}>
              <Button type="button" variant="ghost" className="w-full">
                {auth.magicLink}
              </Button>
            </motion.div>

            <motion.div variants={fadeUp(0, 8)} className="flex items-center gap-4" aria-hidden>
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-line-strong rtl:bg-gradient-to-l" />
              <span className="text-xs font-medium text-ink-subtle">{auth.or}</span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-line-strong rtl:bg-gradient-to-r" />
            </motion.div>

            <motion.div variants={fadeUp(0, 8)}>
              <Button type="button" variant="outline" size="lg" className="w-full">
                <Icon icon="logos:google-gmail" aria-hidden="true" />
                {auth.gmailButton}
              </Button>
            </motion.div>
          </>
        )}

        <motion.p variants={fadeUp(0, 8)} className="mt-2 px-2 text-center text-xs leading-5 text-ink-muted">
          {auth.legal}
        </motion.p>
      </motion.form>

      {isSignUp && (
        <p className="mt-6 border-t border-line pt-5 text-center text-sm text-ink-muted">
          {switchPrompt}{" "}
          <Link href={switchHref} className="rounded-md font-semibold text-teal-700 underline-offset-4 hover:underline">
            {switchLink}
          </Link>
        </p>
      )}
    </motion.div>
  );
}
