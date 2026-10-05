import type { Metadata } from "next";
import { ROUTES } from "@/lib/config/routes";
import { pageMetadata } from "@/lib/config/site";

// The page is a client component, so its metadata lives in this segment layout.
export const metadata: Metadata = pageMetadata({
  title: "Plans & pricing",
  description: "Compare VitaMind plans: daily check-ins, smart journal, personal baseline, monthly profile and clinician report.",
  path: ROUTES.plans,
});

export default function SubscriptionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
