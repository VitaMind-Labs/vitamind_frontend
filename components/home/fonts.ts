import { Newsreader } from "next/font/google";

/** Editorial serif for home headlines only. Arabic keeps IBM Plex Sans Arabic (see `SERIF` in typography.ts). */
export const homeSerif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-home-serif",
  display: "swap",
});
