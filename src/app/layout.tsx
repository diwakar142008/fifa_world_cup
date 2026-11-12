import type { Metadata, Viewport } from "next";
import "@fontsource/barlow-condensed/500.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";

export const metadata: Metadata = {
  title: {
    default: "StadiumMind AI - Generative AI Operating System for FIFA World Cup 2026",
    template: "%s | StadiumMind AI",
  },
  description:
    "The Generative AI Operating System for FIFA World Cup 2026 Stadiums. Real-time digital twin, multi-agent AI orchestration, predictive analytics, and operational intelligence for stadium operators.",
  keywords: [
    "AI",
    "Stadium",
    "FIFA World Cup 2026",
    "Digital Twin",
    "Crowd Management",
    "Predictive Analytics",
    "Multi-Agent AI",
    "Smart Stadium",
  ],
  authors: [{ name: "StadiumMind AI Team" }],
  creator: "StadiumMind AI",
  publisher: "StadiumMind AI",
  metadataBase: new URL("https://stadium-mind.ai"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stadium-mind.ai",
    siteName: "StadiumMind AI",
    title: "StadiumMind AI - Generative AI OS for FIFA World Cup 2026",
    description:
      "Real-time digital twin, multi-agent AI orchestration, and predictive analytics for stadium operations.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StadiumMind AI Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StadiumMind AI",
    description: "The Generative AI Operating System for FIFA World Cup 2026 Stadiums",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0c1518" },
    { media: "(prefers-color-scheme: light)", color: "#0c1518" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {/* Skip to main content link - WCAG 2.4.1 */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        <AccessibilityProvider>{children}</AccessibilityProvider>
      </body>
    </html>
  );
}
