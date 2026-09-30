import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the custom tokens declared in app/globals.css so that,
// e.g., `text-display` (font size) is not deduped against `text-ink` (color).
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "heading", "title", "lead"],
      shadow: ["xs", "card", "raised", "float", "brand", "focus"],
      radius: ["card", "control"],
      ease: ["out-soft", "in-out-soft"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
