"use client";

import { motion } from "framer-motion";
import {
  ambientDrift,
  ambientDriftTransition,
  ambientFloat,
  ambientFloatTransition,
} from "./motion";

export default function HomeBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        animate={ambientDrift}
        transition={ambientDriftTransition}
        className="absolute -left-24 top-[14%] h-[26rem] w-[26rem] rounded-full blur-[120px]"
        style={{ background: "rgba(81,133,145,0.10)" }}
      />
      <motion.div
        animate={ambientFloat}
        transition={{ ...ambientFloatTransition, duration: 16 }}
        className="absolute right-[-8%] top-[36%] h-[32rem] w-[32rem] rounded-full blur-[130px]"
        style={{ background: "rgba(227,176,28,0.08)" }}
      />
      <motion.div
        animate={ambientDrift}
        transition={{ ...ambientDriftTransition, duration: 22 }}
        className="absolute bottom-[-8%] left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full blur-[140px]"
        style={{ background: "rgba(44,62,59,0.06)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "radial-gradient(circle at top, rgba(81,133,145,0.65), transparent 35%), linear-gradient(rgba(44,62,59,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(44,62,59,0.12) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 72px 72px, 72px 72px",
        }}
      />
    </div>
  );
}
