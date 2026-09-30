import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/config/routes";

/** Legacy URL: results now live at /orientation/result/:sessionId (next.config.ts also redirects). */
export default async function LegacyDiagnosticResultPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  redirect(`${ROUTES.orientation}/result/${encodeURIComponent(sessionId)}`);
}
