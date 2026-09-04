import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GlowDesk",
  description:
    "White-label consultation platform for makeup artists, skincare specialists, and beauty therapists.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Italiana&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Spline+Sans+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
