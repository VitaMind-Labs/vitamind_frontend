import type { Metadata } from "next";
import { Header } from "@/app/home/_components";
import { AuthScreen } from "@/components/auth/AuthScreen";

export const metadata: Metadata = {
  title: "Sign in | VitaMind",
  description: "Secure sign in experience for VitaMind users.",
};

export default function SignInPage() {
  return (
    <>
      <Header />
      <AuthScreen mode="signin" />
    </>
  );
}
