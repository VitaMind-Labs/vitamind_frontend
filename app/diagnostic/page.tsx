import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/config/routes";

/** Legacy URL: the conversation now lives at /orientation (next.config.ts also redirects). */
export default async function LegacyDiagnosticPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    for (const item of Array.isArray(value) ? value : value ? [value] : []) params.append(key, item);
  }
  const query = params.toString();
  redirect(query ? `${ROUTES.orientation}?${query}` : ROUTES.orientation);
}
