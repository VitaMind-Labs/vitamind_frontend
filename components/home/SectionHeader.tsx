"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  icon?: ReactNode;
  titleA: string;
  titleB?: string;
  intro?: string;
  align?: "start" | "center";
  className?: string;
};

/** Eyebrow + two-tone heading + intro, revealed together. Shared by every landing section. */
export function SectionHeader({ eyebrow, icon, titleA, titleB, intro, align = "start", className }: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <motion.header
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={REVEAL_VIEWPORT}
      className={cn("max-w-3xl", centered && "mx-auto text-center", className)}
    >
      <motion.p
        variants={fadeUp()}
        className="home-eyebrow inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white px-3.5 py-1.5 shadow-xs"
      >
        {icon}
        {eyebrow}
      </motion.p>
      <motion.h2 variants={fadeUp()} className="home-heading mt-5">
        {titleA}
        {titleB ? (
          <>
            {" "}
            <span className="home-heading-accent">{titleB}</span>
          </>
        ) : null}
      </motion.h2>
      {intro ? (
        <motion.p variants={fadeUp()} className={cn("home-body mt-5 max-w-2xl", centered && "mx-auto")}>
          {intro}
        </motion.p>
      ) : null}
    </motion.header>
  );
}
