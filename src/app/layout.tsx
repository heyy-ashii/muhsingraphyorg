import type { Metadata, Viewport } from "next";
import { Amiri, Poppins } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { getSiteContent } from "@/lib/content/load";
import { SiteContentProvider } from "@/lib/content/context";
import { ThemeProvider } from "@/components/site/theme-provider";
import { SmoothScroll } from "@/components/site/smooth-scroll";

const sans = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const display = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const mono = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const arabic = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getSiteContent();
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: `${brand.wordmark.charAt(0)}${brand.wordmark.slice(1).toLowerCase()} — ${brand.tagline}`,
      template: `%s — ${brand.wordmark}`,
    },
    description: brand.description,
    applicationName: brand.wordmark,
    authors: [{ name: "Muhsin" }],
    keywords: [
      "Arabic calligraphy",
      "Islamic art",
      "Thuluth",
      "Diwani",
      "Kufic",
      "gold leaf art",
      "fine art commission",
      "Muhsingraphy",
    ],
    openGraph: {
      title: `${brand.wordmark} — ${brand.tagline}`,
      description: brand.description,
      url: SITE.url,
      siteName: brand.wordmark,
      type: "website",
      images: [{ url: "/assets/artwork-01.jpg", width: 1599, height: 1600, alt: "Calligraphy by Muhsin" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${brand.wordmark} — ${brand.tagline}`,
      description: brand.description,
    },
    icons: {
      icon: brand.faviconUrl,
      apple: "/assets/apple-touch-icon.png",
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#F5F4F0" }],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable} ${arabic.variable}`}
    >
      <body className="min-h-dvh bg-canvas text-ink antialiased">
        <SiteContentProvider content={content}>
          <ThemeProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </ThemeProvider>
        </SiteContentProvider>
      </body>
    </html>
  );
}
