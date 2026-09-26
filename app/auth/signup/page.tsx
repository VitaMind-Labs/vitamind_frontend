import { AuthLayout, AuthLoading } from "@/components/auth/AuthLayout";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { BRAND } from "@/lib/config/brand";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `Sign up | ${BRAND.name}`,
  description: `Create your ${BRAND.name} account and start your wellness journey.`,
};

export default function SignUpPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<AuthLoading />}>
        <AuthScreen mode="signup" />
      </Suspense>
    </AuthLayout>
  );
}
