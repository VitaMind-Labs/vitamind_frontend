import type { Metadata } from "next";
import { BRAND } from "@/lib/config/brand";
import Home from "./home/page";

export const metadata: Metadata = {
  title: `${BRAND.name} - Guided mental wellbeing`,
  description:
    "A cinematic mental wellness experience blending premium scientific minimalism, emotional calm, and secure AI support.",
  openGraph: {
    title: `${BRAND.name} - Guided mental wellbeing`,
    description:
      "A futuristic mental wellness platform with editorial whitespace, calm interactions, and cinematic healthcare storytelling.",
  },
};

export default function Page() {
  return <Home />;
}
