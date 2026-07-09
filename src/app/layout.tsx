import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import CustomCursor from "@/components/landing/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | StadiumMind AI",
    default: "StadiumMind AI — The Generative AI OS for FIFA World Cup 2026",
  },
  description:
    "StadiumMind AI is the Generative AI Operating System for FIFA World Cup 2026 stadiums. Real-time digital twin, multi-agent AI orchestration, predictive analytics, and intelligent operations for fans, organizers, and staff.",
  keywords: [
    "FIFA World Cup 2026",
    "Stadium AI",
    "Digital Twin",
    "Generative AI",
    "Stadium Operations",
    "AI Stadium Management",
    "World Cup Technology",
    "Smart Stadium",
  ],
  authors: [{ name: "StadiumMind AI" }],
  openGraph: {
    title: "StadiumMind AI — The Generative AI OS for FIFA World Cup 2026",
    description:
      "Real-time digital twin, predictive AI, and multi-agent orchestration for every stadium at FIFA World Cup 2026.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "StadiumMind AI",
    description:
      "The Generative AI Operating System for FIFA World Cup 2026 Stadiums.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#050510" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="min-h-screen bg-[#050510] text-stadium-50 antialiased selection:bg-gold-500/30 selection:text-white">
        {/* Skip to content link — WCAG 2.4.1 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-gold-500 focus:text-[#050510] focus:font-semibold focus:text-sm focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Custom cursor (desktop only) */}
        <CustomCursor />

        {/* Grid overlay */}
        <div className="fixed inset-0 stadium-grid pointer-events-none z-0" />
        {/* Glow orbs */}
        <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-stadium-500/10 blur-[120px] pointer-events-none z-0 animate-orb-pulse" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gold-500/8 blur-[100px] pointer-events-none z-0 animate-orb-float" />
        <div className="fixed top-[40%] right-[-5%] w-[30%] h-[30%] rounded-full bg-stadium-400/8 blur-[80px] pointer-events-none z-0" />

        <AccessibilityProvider>{children}</AccessibilityProvider>
      </body>
    </html>
  );
}
