import { AuthLayout, AuthLoading } from "@/components/auth/AuthLayout";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { BRAND } from "@/lib/config/brand";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `Sign in | ${BRAND.name}`,
  description: `Secure sign in experience for ${BRAND.name} users.`,
};

export default function SignInPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<AuthLoading />}>
        <AuthScreen mode="signin" />
      </Suspense>
    </AuthLayout>
  );
}
