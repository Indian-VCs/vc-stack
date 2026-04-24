import type { Metadata } from "next";
import Script from "next/script";
import { TOTAL_TOOL_APPEARANCES, TOTAL_CATEGORIES, CATEGORY_COUNTS } from "@/lib/stats";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VC Stack 2026 | Indian VCs",
    template: "%s · Indian VCs",
  },
  description:
    `Explore ${TOTAL_TOOL_APPEARANCES}+ tools across ${TOTAL_CATEGORIES} categories powering India's top VCs in 2026 — CRM, AI, research, data, portfolio ops & more. Curated by Indian VCs.`,
  authors: [
    { name: "Indian VCs", url: "https://www.indianvcs.com" },
    { name: "DealQuick Labs Private Limited" },
  ],
  creator: "Indian VCs by DealQuick Labs Private Limited",
  publisher: "DealQuick Labs Private Limited",
  metadataBase: new URL("https://www.indianvcs.com"),
  alternates: {
    canonical: "/vc-stack",
    languages: {
      "en-IN": "/vc-stack",
      "x-default": "/vc-stack",
    },
  },
  openGraph: {
    title: "VC Stack 2026 | Indian VCs",
    description:
      `${TOTAL_TOOL_APPEARANCES}+ tools across ${TOTAL_CATEGORIES} categories — the complete tech stack powering India's top VCs. CRM, AI, Research, Data, News, Vibe Coding & more. Curated by Indian VCs.`,
    url: "https://www.indianvcs.com/vc-stack",
    siteName: "Indian VCs",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "VC Stack 2026 | Indian VCs",
    description:
      `${TOTAL_TOOL_APPEARANCES}+ tools across ${TOTAL_CATEGORIES} categories — the complete tech stack powering India's top VCs. Curated by Indian VCs.`,
    site: "@indianvcs",
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
      "@id": "https://www.indianvcs.com/vc-stack",
      url: "https://www.indianvcs.com/vc-stack",
      name: "VC Stack 2026 | Indian VCs",
      description:
        `The definitive visual market map of ${TOTAL_TOOL_APPEARANCES}+ tools and workflows powering India's top venture capital firms in 2026.`,
      isPartOf: {
        "@type": "WebSite",
        "@id": "https://www.indianvcs.com/#website",
        url: "https://www.indianvcs.com",
        name: "Indian VCs",
        publisher: {
          "@type": "Organization",
          "@id": "https://www.indianvcs.com/#organization",
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
          `${TOTAL_TOOL_APPEARANCES}+ tools across ${TOTAL_CATEGORIES} categories used by India's top venture capital firms`,
        numberOfItems: TOTAL_TOOL_APPEARANCES,
        itemListElement: CATEGORY_COUNTS.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${c.name} (${c.count} tools)`,
          url: `https://www.indianvcs.com/vc-stack/category/${c.slug}`,
        })),
      },
    },
    {
      "@type": "Organization",
      "@id": "https://www.indianvcs.com/#organization",
      name: "Indian VCs",
      legalName: "DealQuick Labs Private Limited",
      url: "https://www.indianvcs.com",
      sameAs: ["https://twitter.com/indianvcs"],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.indianvcs.com/#website",
      url: "https://www.indianvcs.com",
      name: "Indian VCs",
      publisher: {
        "@type": "Organization",
        "@id": "https://www.indianvcs.com/#organization",
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
    <html lang="en" suppressHydrationWarning>
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
