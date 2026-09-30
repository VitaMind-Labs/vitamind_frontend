import type { Metadata } from "next";
import { OrientationPage } from "@/features/diagnostic";

export const metadata: Metadata = {
  title: "Orientation with Mira",
  description: "A private, guided orientation conversation with Mira — not a medical diagnosis.",
};

export default function Page() {
  return <OrientationPage />;
}
