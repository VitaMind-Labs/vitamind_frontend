import type { Metadata } from "next";
import { OrientationPage } from "@/features/diagnostic";
import { ROUTES } from "@/lib/config/routes";
import { pageMetadata } from "@/lib/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Orientation with Mira",
  description:
    "A private, guided conversation with Mira about ADHD, bipolar disorder and psychotic symptoms. It points you to the right next step — it is not a medical diagnosis.",
  path: ROUTES.orientation,
  // Members only: signed-out visitors are sent to create an account first.
  noindex: true,
});

export default function Page() {
  return <OrientationPage />;
}
