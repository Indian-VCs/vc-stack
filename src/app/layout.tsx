import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "VC Stack 2026 | Indian VCs",
  description:
    "Explore the definitive visual market map of 138+ tools and workflows powering India's top venture capital firms in 2026. Curated by Indian VCs across 19 categories including CRM, AI, Research, Data, News, Portfolio Management, Automation, Vibe Coding, and more. Built by DealQuick Labs Private Limited.",
  keywords: [
    "Indian VCs",
    "VC tech stack",
    "venture capital tools",
    "VC tools India",
    "startup ecosystem India",
    "investor tools",
    "VC workflow",
    "CRM for VCs",
    "deal flow tools",
    "portfolio management",
    "market map",
    "tech stack 2026",
    "Indian venture capital",
    "VC landscape",
    "investor tech stack",
    "VC software India",
    "venture capital India 2026",
    "Indian startup tools",
    "VC market map India",
    "investor workflow tools",
    "VC automation tools",
    "AI tools for VCs",
    "research tools for investors",
    "vibe coding",
    "VC data tools",
    "VC news aggregator",
    "captable management India",
    "VC portfolio tracking",
    "fund management tools",
    "startup deal flow",
    "Indian VC ecosystem",
    "venture capital technology",
    "VC productivity tools",
    "investor CRM India",
    "VC communication tools",
    "VC browser extensions",
    "transcription tools for VCs",
    "mailing tools for investors",
  ],
  authors: [
    { name: "Indian VCs", url: "https://indianvcs.com" },
    { name: "DealQuick Labs Private Limited" },
  ],
  creator: "Indian VCs by DealQuick Labs Private Limited",
  publisher: "DealQuick Labs Private Limited",
  metadataBase: new URL("https://indianvcs.com"),
  alternates: {
    canonical: "/tech-stack",
  },
  openGraph: {
    title: "VC Stack 2026 | Indian VCs",
    description:
      "138+ tools across 19 categories — the complete tech stack powering India's top VCs. CRM, AI, Research, Data, News, Vibe Coding & more. Curated by Indian VCs.",
    url: "https://indianvcs.com/tech-stack",
    siteName: "Indian VCs",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "VC Stack 2026 | Indian VCs",
    description:
      "138+ tools across 19 categories — the complete tech stack powering India's top VCs. Curated by Indian VCs.",
    creator: "@indianvcs",
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

/* Allow pinch-to-zoom on mobile */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

/* JSON-LD Structured Data */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://indianvcs.com/tech-stack",
      url: "https://indianvcs.com/tech-stack",
      name: "VC Stack 2026 | Indian VCs",
      description:
        "The definitive visual market map of 138+ tools and workflows powering India's top venture capital firms in 2026.",
      isPartOf: {
        "@type": "WebSite",
        "@id": "https://indianvcs.com/#website",
        url: "https://indianvcs.com",
        name: "Indian VCs",
        publisher: {
          "@type": "Organization",
          "@id": "https://indianvcs.com/#organization",
        },
      },
      about: {
        "@type": "Thing",
        name: "Venture Capital Technology Stack",
        description:
          "Tools and software used by Indian venture capital firms",
      },
      mainEntity: {
        "@type": "ItemList",
        name: "VC Tech Stack 2026 — Tools by Category",
        description:
          "138+ tools across 19 categories used by India's top venture capital firms",
        numberOfItems: 138,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "CRM (12 tools)" },
          { "@type": "ListItem", position: 2, name: "Data (13 tools)" },
          { "@type": "ListItem", position: 3, name: "Research (15 tools)" },
          { "@type": "ListItem", position: 4, name: "News (14 tools)" },
          { "@type": "ListItem", position: 5, name: "AI (7 tools)" },
          { "@type": "ListItem", position: 6, name: "Other Tools (23 tools)" },
          { "@type": "ListItem", position: 7, name: "Vibe Coding (5 tools)" },
          { "@type": "ListItem", position: 8, name: "Browser (6 tools)" },
          { "@type": "ListItem", position: 9, name: "Transcription (6 tools)" },
          { "@type": "ListItem", position: 10, name: "Productivity (4 tools)" },
          { "@type": "ListItem", position: 11, name: "Communication (4 tools)" },
          { "@type": "ListItem", position: 12, name: "Automation (4 tools)" },
          { "@type": "ListItem", position: 13, name: "Admin/Ops (4 tools)" },
          { "@type": "ListItem", position: 14, name: "Voice to Text (4 tools)" },
          { "@type": "ListItem", position: 15, name: "Mailing (4 tools)" },
          { "@type": "ListItem", position: 16, name: "Calendar (4 tools)" },
          { "@type": "ListItem", position: 17, name: "Captable (3 tools)" },
          { "@type": "ListItem", position: 18, name: "Finance (3 tools)" },
          {
            "@type": "ListItem",
            position: 19,
            name: "Portfolio Management (3 tools)",
          },
        ],
      },
    },
    {
      "@type": "Organization",
      "@id": "https://indianvcs.com/#organization",
      name: "Indian VCs",
      legalName: "DealQuick Labs Private Limited",
      url: "https://indianvcs.com",
      sameAs: ["https://twitter.com/indianvcs"],
    },
    {
      "@type": "WebSite",
      "@id": "https://indianvcs.com/#website",
      url: "https://indianvcs.com",
      name: "Indian VCs",
      publisher: {
        "@type": "Organization",
        "@id": "https://indianvcs.com/#organization",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-P2Z77C6G');
        `}</Script>
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
      </head>
      <body>
        {/* Google Tag Manager (noscript fallback) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P2Z77C6G"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
