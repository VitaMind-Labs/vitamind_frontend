import type { Metadata } from "next";
import { pageMetadata } from "@/lib/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Checkout",
  description: "Complete your VitaMind subscription securely.",
  path: "/subscription/payment",
  noindex: true,
});

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
