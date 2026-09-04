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
  title: "GlowDesk",
  description: "Consultation, skin analysis, and client records for beauty professionals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
