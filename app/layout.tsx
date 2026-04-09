import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily MLB Home Run Picks & Parlay Builder",
  description: "Data-driven MLB HR picks using matchup grades, park factors, and pitcher tendencies. Updated daily.",
  openGraph: {
    title: "Daily MLB Home Run Picks & Parlay Builder",
    description: "Sharp HR prop research — tiered picks, parlays, and longshots for today's MLB slate.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#0A0A0F" }}>
        {children}
      </body>
    </html>
  );
}
