import { AppProviders } from "@/components/providers/AppProviders";
import { BRAND } from "@/lib/config/brand";
import { ROOT_SOCIAL, SITE } from "@/lib/config/site";
import { LANGS, LANGUAGE_STORAGE_KEY, normalizeLanguage } from "@/lib/i18n/config";
import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL(SITE.url),
  applicationName: BRAND.name,
  title: {
    default: SITE.title,
    template: `%s | ${BRAND.name}`,
  },
  description: SITE.description,
  icons: {
    icon: "/assets/logo.svg",
    apple: "/assets/vitamind-mark-3d.png",
  },
  ...ROOT_SOCIAL,
  // Google Search Console: set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to the token it gives for the "HTML tag" method.
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
};

/** On Android the on-screen keyboard resizes the page, so a chat composer stays above it instead of hiding under it. */
export const viewport: Viewport = { width: "device-width", initialScale: 1, interactiveWidget: "resizes-content" };

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
