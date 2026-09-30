import type { Metadata } from "next";
import { OrientationResultPage } from "@/features/diagnostic";

export const metadata: Metadata = {
  title: "Your orientation",
  description: "Your orientation summary with Mira — a starting point to share with a professional.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OrientationResultPage />;
}
