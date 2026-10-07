import type { Metadata } from "next";
import { SupportScreen } from "@/components/support/SupportScreen";
import { ROUTES } from "@/lib/config/routes";
import { pageMetadata } from "@/lib/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Support",
  description: "Questions about SynQ, your privacy or your account? Write to the team: we reply within one working day.",
  path: ROUTES.support,
});

export default function SupportPage() {
  return <SupportScreen />;
}
