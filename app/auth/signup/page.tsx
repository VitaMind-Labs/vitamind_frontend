import { AuthLayout, AuthLoading } from "@/components/auth/AuthLayout";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { ROUTES } from "@/lib/config/routes";
import { pageMetadata } from "@/lib/config/site";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = pageMetadata({
  title: "Create your account",
  description: "Create your SynQ account to follow your mood, energy, focus and sleep day by day, privately.",
  path: ROUTES.signUp,
});

export default function SignUpPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<AuthLoading />}>
        <AuthScreen mode="signup" />
      </Suspense>
    </AuthLayout>
  );
}
