import { ROUTES } from "@/lib/config/routes";

export type AgentId = "mira" | "lumina";

/** Presentation of each agent in the header; copy lives in `dictionary.header.agents.items`. */
export const AGENTS: ReadonlyArray<{
  id: AgentId;
  href: string;
  /** `live` pulses (open to everyone now); `member` is a calm steady dot. */
  status: "live" | "member";
  tone: { ring: string; tint: string; text: string; dot: string };
}> = [
  {
    id: "mira",
    href: ROUTES.orientation,
    status: "live",
    tone: { ring: "group-hover:ring-teal-200", tint: "bg-teal-50/80", text: "text-teal-700", dot: "bg-sage" },
  },
  {
    id: "lumina",
    href: ROUTES.plans,
    status: "member",
    tone: { ring: "group-hover:ring-gold-100", tint: "bg-gold-50/80", text: "text-gold-700", dot: "bg-gold" },
  },
];

/** Top-level destinations (no in-page home anchors). `agents` opens the agents panel. */
export const PRIMARY_LINKS = [
  { id: "agents", href: null },
  { id: "plans", href: ROUTES.plans },
  { id: "support", href: ROUTES.support },
] as const;

export type PrimaryLinkId = (typeof PRIMARY_LINKS)[number]["id"];

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
