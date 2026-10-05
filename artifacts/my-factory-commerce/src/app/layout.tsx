import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Factory Commerce OS",
  description: "Multi-tenant B2B storefronts for export manufacturers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;650&family=Newsreader:opsz,wght@6..72,500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
