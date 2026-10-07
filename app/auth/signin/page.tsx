import { AuthLayout, AuthLoading } from "@/components/auth/AuthLayout";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { ROUTES } from "@/lib/config/routes";
import { pageMetadata } from "@/lib/config/site";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = pageMetadata({
  title: "Sign in",
  description: "Sign in to your private SynQ space to continue your daily check-ins and follow your progress.",
  path: ROUTES.signIn,
  noindex: true,
});

export default function SignInPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<AuthLoading />}>
        <AuthScreen mode="signin" />
      </Suspense>
    </AuthLayout>
  );
}
