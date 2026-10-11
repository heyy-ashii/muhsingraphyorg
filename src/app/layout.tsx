import type { Metadata, Viewport } from "next";
import {
  Amiri,
  Cinzel,
  Cormorant_Garamond,
  JetBrains_Mono,
  Manrope,
} from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { getSiteContent } from "@/lib/content/load";
import { SiteContentProvider } from "@/lib/content/context";
import { ThemeProvider } from "@/components/site/theme-provider";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { GrainOverlay } from "@/components/site/grain-overlay";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const arabic = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cinzel",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0B" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeBootstrap = `(function(){try{var t=localStorage.getItem('mhg-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var r=document.documentElement;if(t==='dark'){r.classList.add('dark');r.style.colorScheme='dark';}else{r.classList.remove('dark');r.style.colorScheme='light';}}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable} ${arabic.variable} ${cinzel.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-dvh bg-canvas text-ink antialiased">
        <SiteContentProvider content={content}>
          <ThemeProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </ThemeProvider>
        </SiteContentProvider>
        <GrainOverlay />
      </body>
    </html>
  );
}
