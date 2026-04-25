import type { NextConfig } from "next";

// ── Security headers ──
// Applied to every request. Tuned for the actual third parties this app uses:
//   - GTM / GA (script-src + connect-src)
//   - Google's favicon service (img-src www.google.com)
//   - Webflow CDN (img-src cdn.prod.website-files.com)
// `'unsafe-inline'` for scripts is required by Next.js 16 hydration and inline
// JSON-LD <script> tags. A nonce-based CSP is the next upgrade once the public
// site stabilises.
//
// Roll changes out in `Content-Security-Policy-Report-Only` first if you tune
// the directives below — a broken CSP silently breaks GTM and GA.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.googletagmanager.com",
  "frame-src 'self' https://*.substack.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join('; ')

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
]

const nextConfig: NextConfig = {
  // ── Mount path for Webflow Cloud ──
  // Deployed at indianvcs.com/vc-stack. Next.js auto-prefixes every route,
  // <Link>, and static asset with this path — no other code changes needed.
  basePath: "/vc-stack",
  assetPrefix: "/vc-stack",
  images: {
    remotePatterns: [
      { hostname: 'cdn.prod.website-files.com' },
      { hostname: 'www.google.com' },
    ],
  },
  async headers() {
    return [
      { source: '/:path*', headers: SECURITY_HEADERS },
      // Belt-and-braces for the admin surface: also forbid caching anywhere.
      {
        source: '/admin/:path*',
        headers: [
          ...SECURITY_HEADERS,
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, private' },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
      {
        source: '/api/admin/:path*',
        headers: [
          ...SECURITY_HEADERS,
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, private' },
        ],
      },
    ]
  },
};

export default nextConfig;
