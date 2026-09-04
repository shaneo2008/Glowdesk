import type { Metadata } from "next";
import { Italiana, Instrument_Sans, Spline_Sans_Mono } from "next/font/google";
import "./globals.css";

const display = Italiana({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = Spline_Sans_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Glowdesk — Try the look",
  description:
    "A camera-first beauty discovery studio for trying creator-made looks and exploring products.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
