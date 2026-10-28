import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const shoulders = localFont({
  src: "./fonts/BigShoulders.woff2",
  variable: "--font-shoulders",
  weight: "100 900",
  display: "swap",
  preload: true,
});

const manrope = localFont({
  src: "./fonts/Manrope.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Sizzle Nest — Burgers, Broast & Pizza",
  description: "Burgers, broast and pizza, made to order. Browse the menu and order on WhatsApp.",
  // Independent concept site — keep it out of search indexes until the owner approves.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${shoulders.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
