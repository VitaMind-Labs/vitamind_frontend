import { Activity, BookOpen, ClipboardCheck, FileText, HeartHandshake, HeartPulse, Languages, MessageCircleHeart, Route, ShieldAlert, TrendingUp, type LucideIcon } from "lucide-react";
import type { AgentId } from "@/components/layout/site-header";

/**
 * Small presentation tokens per agent. Mira is teal and aqua, Lumina champagne and gold — the two sides of the logo.
 * Copy lives in `lib/i18n/agents.ts`; status and tone tokens in `site-header/agents.ts`.
 */
export const AGENT_THEME: Record<AgentId, { label: string; icons: readonly LucideIcon[] }> = {
  mira: { label: "text-teal-700", icons: [MessageCircleHeart, ClipboardCheck, Route, ShieldAlert, FileText, Languages] },
  lumina: { label: "text-gold-700", icons: [HeartHandshake, HeartPulse, BookOpen, Activity, TrendingUp, FileText] },
};
