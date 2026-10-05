import type { Metadata } from "next";
import { OrientationResultPage } from "@/features/diagnostic";
import { ROUTES } from "@/lib/config/routes";
import { pageMetadata } from "@/lib/config/site";

// Personal result: kept out of search results and previews it would otherwise advertise.
export const metadata: Metadata = pageMetadata({
  title: "Your orientation",
  description: "Your orientation summary with Mira — a starting point to share with a professional.",
  path: ROUTES.orientation,
  noindex: true,
});

export default function Page() {
  return <OrientationResultPage />;
}
