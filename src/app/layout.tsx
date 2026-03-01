import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Indian VC Stack",
  description:
    "Visual landscape of 147 tools used by VCs and angel investors, curated by Indian VCs",
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
          href="https://fonts.googleapis.com/css2?family=Arapey:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=1920" />
      </head>
      <body>{children}</body>
    </html>
  );
}
