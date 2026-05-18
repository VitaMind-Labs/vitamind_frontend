import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthScreen } from "@/components/auth/AuthScreen";
import AuthHeader from "../_components/Authheader";

export const metadata: Metadata = {
  title: "Sign in | VitaMind",
  description: "Secure sign in experience for VitaMind users.",
};

export default function SignInPage() {
  return (
    <>
      <AuthHeader />
      <Suspense fallback={null}>
        <AuthScreen mode="signin" />
      </Suspense>
    </>
  );
}
