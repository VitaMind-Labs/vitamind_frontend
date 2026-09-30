"use client";

import { motion } from "framer-motion";
import { REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  /** Heading id — referenced by the section's `aria-labelledby`. */
  id: string;
  eyebrow: string;
  titleA: string;
  titleB?: string;
  intro?: string;
  align?: "start" | "center";
  /** `split` places the intro in the end column on large screens (editorial). */
  layout?: "stack" | "split";
  /** `h1` when the header opens a page (e.g. /subscription) rather than a home section. */
  as?: "h1" | "h2";
  className?: string;
};

/** Gold rule + eyebrow, two-tone heading, intro — revealed together. Shared by every home section. */
export function SectionHeader({ id, eyebrow, titleA, titleB, intro, align = "start", layout = "stack", as = "h2", className }: SectionHeaderProps) {
  const centered = align === "center";
  const split = layout === "split" && !centered;
  const Heading = as === "h1" ? motion.h1 : motion.h2;

  return (
    <motion.header
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={REVEAL_VIEWPORT}
      className={cn(
        split ? "grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-10" : "max-w-3xl",
        centered && "mx-auto text-center",
        className,
      )}
    >
      <div className={cn(split && "lg:col-span-7")}>
        <motion.p variants={fadeUp()} className={cn("home-eyebrow flex items-center gap-3", centered && "justify-center")}>
          <span aria-hidden className="h-px w-8 shrink-0 bg-gold" />
          {eyebrow}
        </motion.p>
        <Heading id={id} variants={fadeUp()} className="home-heading mt-5">
          {titleA}
          {titleB ? (
            <>
              {" "}
              <span className="home-heading-accent">{titleB}</span>
            </>
          ) : null}
        </Heading>
      </div>
      {intro ? (
        <motion.p
          variants={fadeUp()}
          className={cn("home-body max-w-2xl", split ? "lg:col-span-5 lg:col-start-8 lg:pb-1.5" : "mt-5", centered && "mx-auto")}
        >
          {intro}
        </motion.p>
      ) : null}
    </motion.header>
  );
}
