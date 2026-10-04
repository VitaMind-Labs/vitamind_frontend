"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { clearDiagnosticClaim, fingerprintHeaders, getDiagnosticClaimToken, getStoredDiagnosticSessionId } from "@/features/diagnostic";
import { authApi } from "@/lib/api/auth";
import { hasValidSession, type AuthTokens } from "@/lib/api/tokens";
import { AuthLoading } from "@/components/auth/AuthLayout";
import { setUser } from "@/lib/storage/storage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { FormField, IconInput } from "@/components/shared/FormField";
import { defaultCountry, PhoneField, toE164, type PhoneValue } from "@/components/shared/PhoneField";
import { DURATION, EASE_OUT, fadeUp, stagger } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { prefetchPatientHome } from "@/lib/patient/prefetch";
import { cn } from "@/lib/utils";
import { LogoSpinner } from "@/components/shared/LogoLoader";

type AuthMode = "signin" | "signup";

/**
 * Funnel: signup → subscription → dashboard. Honour internal redirects to the
 * subscription/payment or dashboard areas; ignore anything else (open-redirect safe).
 */
function safeRedirect(redirect: string | null) {
  return redirect && /^\/(subscription|dashboard)(\/|\?|$)/.test(redirect) ? redirect : "/dashboard";
}

const noSubscribe = () => () => {};
type FormValues = { nickname: string; email: string; password: string; confirmPassword: string };
type FieldName = keyof FormValues | "phone";

const LINK_CLASS =
  "rounded-md font-semibold text-teal-700 underline-offset-4 transition-colors duration-200 hover:text-teal-800 hover:underline";

function VisibilityToggle({ show, toggle, label }: { show: boolean; toggle: () => void; label: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      aria-pressed={show}
      onClick={toggle}
      className="size-9 min-h-9 rounded-full text-ink-muted hover:bg-teal-50 hover:text-teal-700"
    >
      {show ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
    </Button>
  );
}

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { dictionary, direction, language } = useLanguage();
  const auth = dictionary.auth;
  const isSignUp = mode === "signup";
  // Already signed in with a live session: skip the form and go straight to the patient space.
  const signedIn = useSyncExternalStore(noSubscribe, hasValidSession, () => null);

  useEffect(() => {
    if (!signedIn) return;
    const target = safeRedirect(searchParams.get("redirect"));
    if (target.startsWith("/dashboard")) prefetchPatientHome();
    router.replace(target);
  }, [signedIn, router, searchParams]);

  // Sign-in is the way into the dashboard: fetch its code while the patient types, so arriving there is instant.
  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  const [values, setValues] = useState<FormValues>({ nickname: "", email: "", password: "", confirmPassword: "" });
  const [phone, setPhone] = useState<PhoneValue>(() => ({ country: defaultCountry(language), national: "" }));
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<FieldName | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // UI preference only — session persistence is unchanged until the backend exposes it.
  const [remember, setRemember] = useState(true);

  const set = (f: FieldName) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(p => ({ ...p, [f]: e.target.value }));
    if (errorField === f) { setError(""); setErrorField(null); }
  };
  const fail = (field: FieldName, message: string) => { setErrorField(field); setError(message); };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(""); setErrorField(null);
    if (isSignUp && !values.nickname.trim()) return fail("nickname", auth.errors.nickname);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return fail("email", auth.errors.email);
    const e164 = isSignUp ? toE164(phone) : null;
    if (isSignUp && !e164) return fail("phone", auth.errors.phone);
    if (values.password.length < 8) return fail("password", auth.errors.password);
    if (isSignUp && values.password !== values.confirmPassword) return fail("confirmPassword", auth.errors.confirmPassword);

    startTransition(() => {
      (async () => {
        const sid = searchParams.get("sessionId") || getStoredDiagnosticSessionId();
        const claimToken = sid ? getDiagnosticClaimToken(sid) : null;
        const email = values.email.trim();
        try {
          let session: AuthTokens;
          const target = safeRedirect(searchParams.get("redirect"));
          if (isSignUp) {
            const res = await authApi.register({
              nickname: values.nickname.trim(), email, phone: e164 ?? undefined, password: values.password, lang: language,
              diagnosticSessionId: sid, diagnosticClaimToken: claimToken,
            });
            session = res;
            if (sid && res.diagnostic?.claimed) clearDiagnosticClaim(sid);
          } else {
            session = await authApi.login(email, values.password);
            // Returning visitor who ran Mira anonymously: attach that session (best-effort). The claim carries the
            // orientation onto the account, which the profile's track is read from, so it still finishes before the
            // profile is fetched; with nothing to claim, nothing waits.
            const claiming = sid
              ? authApi.claimDiagnostic(sid, claimToken, fingerprintHeaders())
                  .then((claim) => claim.claimed && clearDiagnosticClaim(sid))
                  .catch(() => undefined)
              : null;
            router.prefetch(target);
            await claiming;
          }
          if (session.user) setUser({ id: session.user.id, fullName: session.user.nickname || email, email, password: "", disease: "ADHD", createdAt: new Date().toISOString() });
          // The first screens' data loads in parallel with the navigation itself.
          if (target.startsWith("/dashboard")) prefetchPatientHome();
          router.push(target);
        } catch (err) { setError(err instanceof Error ? err.message : "Authentication failed"); }
      })();
    });
  };

  const fieldError = (field: FieldName) => (errorField === field ? error : null);
  const formError = error && !errorField ? error : "";
  const switchHref = isSignUp ? "/auth/signin" : "/auth/signup";
  const switchPrompt = isSignUp ? auth.switchToSignIn : auth.subtitleSignIn;
  const switchLink = isSignUp ? auth.switchSignInLink : auth.subtitleSignInLink;

  if (signedIn !== false) return <AuthLoading />;

  return (
    <motion.section
      dir={direction}
      aria-labelledby="auth-title"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: 0.1 }}
      className="relative w-full rounded-2xl border border-line-strong/70 bg-white p-6 shadow-[var(--shadow-soft)] sm:p-9 lg:p-10"
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
      {/* ── HEADING ──────────────────────────────────────────────────── */}
      <header>
        <p className="inline-flex items-center gap-2 rounded-full border border-line-strong/70 bg-surface-muted px-3 py-1.5 text-[0.8125rem] font-medium text-ink-soft">
          <ShieldCheck className="size-3.5 text-teal-600" aria-hidden />
          {auth.badge}
        </p>
        <h1
          id="auth-title"
          className="mt-6 text-[clamp(1.875rem,1.2vw+1.5rem,2.375rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-ink rtl:tracking-normal"
        >
          {isSignUp ? auth.titleSignUpA : auth.titleSignInA}{" "}
          <span className="text-ink-muted">{isSignUp ? auth.titleSignUpB : auth.titleSignInB}</span>
        </h1>
        <p className="mt-3 text-[1rem] leading-7 text-ink-soft">
          {isSignUp ? auth.subtitleSignUp : auth.subtitleWelcome}
        </p>
      </header>

      {/* ── SERVER ERROR ─────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {formError && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-rose-100 bg-rose-50 px-3.5 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" aria-hidden />
              <p className="text-[0.8125rem] leading-5 text-rose-700">{formError}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ALTERNATIVE FIRST (sign-in): one tap in, then the email form ──────── */}
      {!isSignUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT, delay: 0.2 }}
          className="mt-7"
        >
          <Button type="button" variant="outline" size="lg" className="w-full gap-3 hover:text-ink">
            <Icon icon="logos:google-icon" aria-hidden="true" />
            {auth.gmailButton}
          </Button>
          <div className="mt-5 flex items-center gap-3">
            <Separator className="flex-1 bg-line" />
            <span className="shrink-0 text-[0.8125rem] font-medium text-ink-soft">{auth.or}</span>
            <Separator className="flex-1 bg-line" />
          </div>
        </motion.div>
      )}

      {/* ── PRIMARY: CREDENTIALS ─────────────────────────────────────── */}
      <motion.form
        key={mode}
        noValidate
        onSubmit={handleSubmit}
        variants={stagger(0.05, 0.15)}
        initial="hidden"
        animate="show"
        className={cn("flex flex-col gap-5", isSignUp ? "mt-7" : "mt-6")}
        aria-busy={isPending}
      >
        {isSignUp && (
          <motion.div variants={fadeUp(0, 8)}>
            <FormField id="auth-nickname" label={auth.nickname} error={fieldError("nickname")}>
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
          <FormField id="auth-email" label={auth.email} error={fieldError("email")}>
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
            <FormField id="auth-phone" label={auth.phone} error={fieldError("phone")}>
              <PhoneField
                id="auth-phone"
                value={phone}
                onChange={(next) => { setPhone(next); if (errorField === "phone") { setError(""); setErrorField(null); } }}
                language={language}
                placeholder={auth.phonePlaceholder}
                invalid={errorField === "phone"}
                countryLabel={auth.countryCode}
                searchPlaceholder={auth.countrySearch}
                noResults={auth.countryNoResults}
              />
            </FormField>
          </motion.div>
        )}

        <motion.div variants={fadeUp(0, 8)}>
          <FormField id="auth-password" label={auth.password} error={fieldError("password")}>
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
            <FormField id="auth-confirm-password" label={auth.confirmPassword} error={fieldError("confirmPassword")}>
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

        {!isSignUp && (
          <motion.div variants={fadeUp(0, 8)} className="-my-1.5 flex flex-wrap items-center justify-between gap-x-4">
            <label htmlFor="auth-remember" className="inline-flex min-h-11 cursor-pointer select-none items-center gap-2.5 text-[0.9375rem] text-ink-soft">
              <Checkbox
                id="auth-remember"
                name="remember"
                checked={remember}
                onCheckedChange={(state) => setRemember(state === true)}
                className="h-[1.125rem] w-[1.125rem] rounded-[0.3125rem] border-line-strong bg-white shadow-none transition-colors duration-200 hover:border-teal-400 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 data-[state=checked]:border-primary [&_svg]:h-3 [&_svg]:w-3"
              />
              {auth.rememberMe}
            </label>
            <Link href="/support" className={`${LINK_CLASS} inline-flex min-h-11 items-center text-[0.9375rem] font-medium`}>
              {auth.forgotPassword}
            </Link>
          </motion.div>
        )}

        <motion.div variants={fadeUp(0, 8)} className="pt-1">
          <Button
            type="submit"
            variant="auth"
            size="lg"
            disabled={isPending}
            aria-busy={isPending}
            className="group min-h-14 bg-ink shadow-[0_18px_36px_-16px_rgb(17_76_97/0.75)] hover:bg-teal-700 hover:shadow-[0_18px_36px_-16px_rgb(17_76_97/0.7)]"
          >
            {isPending ? (
              <>
                <LogoSpinner size={18} />
                <span>{auth.processing}</span>
              </>
            ) : (
              <>
                <span>{isSignUp ? auth.signUpButton : auth.signInButton}</span>
                <ArrowRight
                  className="transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                  aria-hidden
                />
              </>
            )}
          </Button>
          {!isSignUp && (
            <Button type="button" variant="ghost" className="mt-2 w-full text-ink-soft hover:text-teal-800">
              <Mail aria-hidden />
              {auth.magicLink}
            </Button>
          )}
        </motion.div>
      </motion.form>

      {/* ── SWITCH + LEGAL ───────────────────────────────────────────── */}
      <footer className="mt-7 border-t border-line pt-6 text-center">
        <p className="text-[0.9375rem] text-ink-soft">
          {switchPrompt}{" "}
          <Link href={switchHref} className={LINK_CLASS}>
            {switchLink}
          </Link>
        </p>
        <p className="mx-auto mt-3 max-w-xs text-[0.8125rem] leading-5 text-ink-soft">{auth.legal}</p>
      </footer>
    </motion.section>
  );
}
