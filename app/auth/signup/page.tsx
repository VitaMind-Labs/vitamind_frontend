import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthScreen } from "@/components/auth/AuthScreen";
import AuthHeader from "../_components/Authheader";

export const metadata: Metadata = {
  title: "Sign up | VitaMind",
  description: "Create your VitaMind account and start your wellness journey.",
};

export default function SignUpPage() {
  return (
    <>
      <AuthHeader />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#518591] border-t-transparent" />
        </div>
      }>
        <AuthScreen mode="signup" />
      </Suspense>
    </>
  );
}