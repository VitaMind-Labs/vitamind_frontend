import type { Metadata } from "next";
import { pageMetadata } from "@/lib/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Welcome",
  description: "Welcome to your private VitaMind space.",
  path: "/welcome",
  noindex: true,
});

export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
