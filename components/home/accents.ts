/**
 * The three brand accents used to give items identity across the home page.
 * Identity is always paired with a label — never colour alone.
 */
export type Accent = "teal" | "gold" | "sage";

type AccentTokens = { rule: string; icon: string; text: string; activeText: string; border: string; fill: string };

export const ACCENTS: Record<Accent, AccentTokens> = {
  teal: { rule: "bg-teal-500", icon: "bg-teal-50 text-teal-700", text: "text-teal-700", activeText: "group-data-[state=active]:text-teal-700", border: "border-teal-500", fill: "var(--color-teal-500)" },
  gold: { rule: "bg-gold", icon: "bg-gold-50 text-gold-700", text: "text-gold-700", activeText: "group-data-[state=active]:text-gold-700", border: "border-gold", fill: "var(--color-gold)" },
  sage: { rule: "bg-sage", icon: "bg-sage-50 text-sage-700", text: "text-sage-700", activeText: "group-data-[state=active]:text-sage-700", border: "border-sage", fill: "var(--color-sage)" },
};

export const pad = (n: number) => String(n).padStart(2, "0");
