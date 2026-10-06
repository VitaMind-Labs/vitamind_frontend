import type { Lang } from "@/lib/i18n/config";

/** Copy of the forgot / reset password screens. Field labels, the checklist and generic errors come from `auth`. */
type PasswordResetCopy = {
  forgot: {
    title: string;
    subtitle: string;
    submit: string;
    sentTitle: string;
    /** Shown for every address, known or not: the API never says whether an account exists. */
    sentBody: string;
    resend: string;
    resendIn: (seconds: number) => string;
    back: string;
    tooMany: string;
    unavailable: string;
  };
  reset: {
    title: string;
    subtitle: string;
    newPassword: string;
    submit: string;
    doneTitle: string;
    doneBody: string;
    goToSignIn: string;
    invalidTitle: string;
    invalidBody: string;
    requestNew: string;
    backToSignIn: string;
    mismatch: string;
    tooLong: string;
    tooMany: string;
    unavailable: string;
  };
};

export const passwordResetCopy: Record<Lang, PasswordResetCopy> = {
  en: {
    forgot: {
      title: "Forgot your password?",
      subtitle: "Enter the email of your account and we will send you a link to choose a new password.",
      submit: "Send me the link",
      sentTitle: "Check your inbox",
      sentBody: "If an account exists for this email, you will receive a password reset link. It works once and expires soon.",
      resend: "Send the email again",
      resendIn: (seconds) => `Send again in ${seconds}s`,
      back: "Back to sign in",
      tooMany: "Too many attempts. Please wait a few minutes and try again.",
      unavailable: "We could not reach VitaMind. Please try again in a moment.",
    },
    reset: {
      title: "Choose a new password",
      subtitle: "You will be signed out on every device, then you can sign in with the new password.",
      newPassword: "New password",
      submit: "Change my password",
      doneTitle: "Password changed",
      doneBody: "Your password was updated and your other sessions were closed. Sign in with your new password.",
      goToSignIn: "Go to sign in",
      invalidTitle: "This link no longer works",
      invalidBody: "The reset link is invalid, was already used, or has expired. Request a new one to continue.",
      requestNew: "Request a new link",
      backToSignIn: "Back to sign in",
      mismatch: "The two passwords do not match.",
      tooLong: "That password is too long.",
      tooMany: "Too many attempts. Please wait a few minutes and try again.",
      unavailable: "We could not reach VitaMind. Please try again in a moment.",
    },
  },
  ar: {
    forgot: {
      title: "نسيت كلمة المرور؟",
      subtitle: "أدخل البريد الإلكتروني لحسابك وسنرسل لك رابطًا لاختيار كلمة مرور جديدة.",
      submit: "أرسل لي الرابط",
      sentTitle: "تحقق من بريدك",
      sentBody: "إذا كان هناك حساب لهذا البريد الإلكتروني، فستصلك رسالة برابط إعادة تعيين كلمة المرور. يعمل الرابط مرة واحدة وتنتهي صلاحيته قريبًا.",
      resend: "أعد إرسال الرسالة",
      resendIn: (seconds) => `أعد الإرسال بعد ${seconds} ث`,
      back: "العودة إلى تسجيل الدخول",
      tooMany: "محاولات كثيرة. يرجى الانتظار بضع دقائق ثم المحاولة مرة أخرى.",
      unavailable: "تعذّر الوصول إلى VitaMind. يرجى المحاولة بعد قليل.",
    },
    reset: {
      title: "اختر كلمة مرور جديدة",
      subtitle: "سيتم تسجيل خروجك من كل الأجهزة، ثم يمكنك الدخول بكلمة المرور الجديدة.",
      newPassword: "كلمة المرور الجديدة",
      submit: "تغيير كلمة المرور",
      doneTitle: "تم تغيير كلمة المرور",
      doneBody: "تم تحديث كلمة المرور وإغلاق جلساتك الأخرى. سجّل الدخول بكلمة المرور الجديدة.",
      goToSignIn: "الذهاب إلى تسجيل الدخول",
      invalidTitle: "لم يعد هذا الرابط صالحًا",
      invalidBody: "رابط إعادة التعيين غير صالح أو سبق استعماله أو انتهت صلاحيته. اطلب رابطًا جديدًا للمتابعة.",
      requestNew: "اطلب رابطًا جديدًا",
      backToSignIn: "العودة إلى تسجيل الدخول",
      mismatch: "كلمتا المرور غير متطابقتين.",
      tooLong: "كلمة المرور طويلة جدًا.",
      tooMany: "محاولات كثيرة. يرجى الانتظار بضع دقائق ثم المحاولة مرة أخرى.",
      unavailable: "تعذّر الوصول إلى VitaMind. يرجى المحاولة بعد قليل.",
    },
  },
};

/** Same limit as the backend (bcrypt reads at most 72 bytes). */
export const PASSWORD_MAX_BYTES = 72;
