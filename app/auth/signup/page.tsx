import type { Metadata } from "next";
import { Header } from "@/app/home/_components";
import { AuthScreen } from "@/components/auth/AuthScreen";

export const metadata: Metadata = {
  title: "Sign up | VitaMind",
  description: "Create your VitaMind account.",
};

export default function SignUpPage() {
  return (
    <>
      <Header />
      <AuthScreen mode="signup" />
    </>
  );
}
