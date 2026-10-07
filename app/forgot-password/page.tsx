import { AuthLayout } from "@/components/auth/AuthLayout";
import { ForgotPasswordScreen } from "@/components/auth/PasswordResetScreens";
import { ROUTES } from "@/lib/config/routes";
import { pageMetadata } from "@/lib/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "Forgot password",
  description: "Request a link to choose a new password for your private SynQ space.",
  path: ROUTES.forgotPassword,
  noindex: true,
});

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordScreen />
    </AuthLayout>
  );
}
