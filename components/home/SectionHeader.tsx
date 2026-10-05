"use client";

import { motion } from "framer-motion";
import { REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { WordReveal } from "./AnimationUtilities";
import { ACCENT_DARK, ACCENT_LIGHT, BODY, DISPLAY_L, LABEL } from "./typography";

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
  /** `editorial` is the home-page treatment: serif display, quiet label. Other pages keep `classic`. */
  variant?: "classic" | "editorial";
  /** Surface the header sits on (editorial only). */
  tone?: "light" | "dark";
  /** Editorial only: a "03 / 06" index pill and a hairline that runs to the end of the row. */
  counter?: string;
  className?: string;
};

/** Gold rule + eyebrow, two-tone heading, intro — revealed together. Shared by every home section. */
export function SectionHeader({
  id,
  eyebrow,
  titleA,
  titleB,
  intro,
  align = "start",
  layout = "stack",
  as = "h2",
  variant = "classic",
  tone = "light",
  counter,
  className,
}: SectionHeaderProps) {
  const centered = align === "center";
  const split = layout === "split" && !centered;
  const editorial = variant === "editorial";
  const dark = tone === "dark";
  const Heading = as === "h1" ? motion.h1 : motion.h2;
  const indexed = editorial && !!counter;

  return (
    <motion.header
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={REVEAL_VIEWPORT}
      className={cn(
        split ? "grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10" : editorial ? "max-w-4xl" : "max-w-3xl",
        indexed && !centered && "max-w-none",
        centered && "mx-auto text-center",
        className,
      )}
    >
      {indexed ? (
        <motion.div variants={fadeUp(0, 10)} className={cn("flex items-center gap-4", centered && "justify-center", split && "lg:col-span-12")}>
          <span
            dir="ltr"
            className={cn("rounded-full border px-3 py-1 font-mono text-[0.75rem] tabular-nums leading-none", dark ? "border-white/25 text-teal-100" : "border-line-strong text-ink-soft")}
          >
            {counter}
          </span>
          {centered ? null : <span aria-hidden className={cn("h-px flex-1", dark ? "bg-white/15" : "bg-line")} />}
        </motion.div>
      ) : null}
      <div className={cn(split && "lg:col-span-7", indexed && !centered && !split && "max-w-4xl")}>
        <motion.p
          variants={fadeUp()}
          className={cn(editorial ? LABEL : "home-eyebrow", "flex items-center gap-3", centered && "justify-center", editorial && (dark ? "text-teal-200" : "text-teal-700"))}
        >
          <span aria-hidden className={cn("h-px w-8 shrink-0", dark ? "bg-gold-300" : "bg-gold")} />
          {eyebrow}
        </motion.p>

        {editorial ? (
          <Heading id={id} className={cn(DISPLAY_L, "mt-6", dark ? "text-white" : "text-ink")}>
            <WordReveal>{titleA}</WordReveal>
            {titleB ? (
              <>
                {" "}
                <WordReveal className={dark ? ACCENT_DARK : ACCENT_LIGHT} delay={0.12}>
                  {titleB}
                </WordReveal>
              </>
            ) : null}
          </Heading>
        ) : (
          <Heading id={id} variants={fadeUp()} className="home-heading mt-5">
            {titleA}
            {titleB ? (
              <>
                {" "}
                <span className="home-heading-accent">{titleB}</span>
              </>
            ) : null}
          </Heading>
        )}
      </div>

      {intro ? (
        <motion.p
          variants={fadeUp()}
          className={cn(
            editorial ? cn(BODY, dark && "text-teal-100") : "home-body",
            "max-w-2xl",
            split ? "lg:col-span-5 lg:col-start-8 lg:pb-2" : editorial ? "mt-7" : "mt-5",
            centered && "mx-auto",
          )}
        >
          {intro}
        </motion.p>
      ) : null}
    </motion.header>
  );
}
