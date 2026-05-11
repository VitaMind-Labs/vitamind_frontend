import type { Metadata } from "next";
import Home from "./home/page";

export const metadata: Metadata = {
  title: "VitaMind - Luxury Therapeutic AI",
  description:
    "A cinematic mental wellness experience blending premium scientific minimalism, emotional calm, and secure AI support.",
  openGraph: {
    title: "VitaMind - Luxury Therapeutic AI",
    description:
      "A futuristic mental wellness platform with editorial whitespace, calm interactions, and cinematic healthcare storytelling.",
  },
};

export default function Page() {
  return <Home />;
}
