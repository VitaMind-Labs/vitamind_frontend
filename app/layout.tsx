import { AppProviders } from "@/components/providers/AppProviders";
import { BRAND } from "@/lib/config/brand";
import { LANGS, LANGUAGE_STORAGE_KEY, normalizeLanguage } from "@/lib/i18n/config";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: BRAND.name,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-render in the visitor's language so Arabic arrives RTL on first paint (no hydration flip).
  const language = normalizeLanguage((await cookies()).get(LANGUAGE_STORAGE_KEY)?.value);
  const locale = LANGS.find((item) => item.code === language)!;

  return (
    <html
      lang={locale.bcp47}
      dir={locale.dir}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${plexSans.variable} ${plexSansArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders initialLanguage={language}>{children}</AppProviders>
      </body>
    </html>
  );
}
