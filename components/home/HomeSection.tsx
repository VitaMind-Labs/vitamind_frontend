import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Grain } from "./Atmosphere";

type HomeSectionProps = {
  id: string;
  labelledBy: string;
  /**
   * `base` = white, `tint` = canvas opened by a fading hairline, `deep` = full-bleed deep teal.
   * The page breathes light → deep → light; deep is the one place the eye is asked to focus.
   */
  tone?: "base" | "tint" | "deep";
  /** Drop one side of the rhythm when the neighbour shares this surface. */
  spacing?: "both" | "top" | "bottom";
  /** Slide over the previous section (default). Turn off only for the first section after the hero. */
  curtain?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Each section slides up over the previous one with softly rounded shoulders — the page reads as
 * layered sheets rather than stacked boxes. The overlap eats into the previous section's bottom padding.
 */
export const CURTAIN = "rounded-t-[2rem] md:rounded-t-[3.5rem] -mt-8 md:-mt-14";

const SPACING = { both: "section-y", top: "section-pt", bottom: "section-pb" } as const;

const SURFACE = {
  base: "bg-white",
  tint: "bg-canvas",
  deep: "bg-[linear-gradient(160deg,var(--color-teal-900),var(--color-ink)_92%)] text-white",
} as const;

/** The one section shell every home section is built on: surface, rhythm and container. */
export function HomeSection({ id, labelledBy, tone = "base", spacing = "both", curtain = true, className, children }: HomeSectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("relative isolate overflow-x-clip", curtain && CURTAIN, SPACING[spacing], SURFACE[tone], className)}>
      {tone === "deep" ? <Grain /> : null}
      <div className="page-container">{children}</div>
    </section>
  );
}
