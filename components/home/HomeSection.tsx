import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HomeSectionProps = {
  id: string;
  labelledBy: string;
  /** `base` = white, `tint` = canvas opened by a fading hairline. Only two surfaces on the page. */
  tone?: "base" | "tint";
  /** Drop one side of the rhythm when the neighbour shares this surface. */
  spacing?: "both" | "top" | "bottom";
  className?: string;
  children: ReactNode;
};

const SPACING = { both: "section-y", top: "section-pt", bottom: "section-pb" } as const;

/** The one section shell every home section is built on: surface, rhythm and container. */
export function HomeSection({ id, labelledBy, tone = "base", spacing = "both", className, children }: HomeSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative overflow-x-clip", SPACING[spacing], tone === "tint" ? "bg-canvas" : "bg-white", className)}
    >
      {tone === "tint" ? <span aria-hidden className="home-divider" /> : null}
      <div className="page-container">{children}</div>
    </section>
  );
}
