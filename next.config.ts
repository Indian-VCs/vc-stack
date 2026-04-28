import type { NextConfig } from "next";

// ── Security headers ──
// Applied to every request. Tuned for the actual third parties this app uses:
//   - GTM / GA (script-src + connect-src)
//   - Google's favicon service (img-src www.google.com)
//   - Webflow Cloud CDN (script/style/font/img — *.cosmic.webflow.services)
//   - GTM-injected analytics: LinkedIn Insight, Microsoft Clarity, PostHog
//
// Webflow Cloud rewrites Next.js's _next/static/* asset URLs from same-origin
// to its per-project CDN subdomain (e.g. <uuid>.wf-app-prod.cosmic.webflow.services).
// Without that domain in script-src/style-src/font-src, every fresh visitor
// sees an unstyled, un-hydrated page in production.
//
// `'unsafe-inline'` for scripts is required by Next.js 16 hydration and inline
// JSON-LD <script> tags. A nonce-based CSP is the next upgrade once the public
// site stabilises.
//
// GTM allowance is a leaky abstraction: GTM itself loads from googletagmanager.com,
// but every downstream tag (LinkedIn, Clarity, PostHog, etc.) loads from its own
// CDN and needs its own script-src + connect-src entries here. When you add a new
// tag in the GTM UI, you must also extend this CSP — otherwise the tag silently
// fails with a `Refused to load the script` console error and zero data flows.
//
// Roll changes out in `Content-Security-Policy-Report-Only` first if you tune
// the directives below — a broken CSP silently breaks GTM and GA.
const WEBFLOW_CDN = "https://*.cosmic.webflow.services"
// LinkedIn Insight Tag: snap.licdn.com (script), px.ads.linkedin.com (pixel beacon).
// Microsoft Clarity: www.clarity.ms / *.clarity.ms (script + recording endpoint), c.bing.com (Bing Ads attribution).
// PostHog (US cluster): us-assets.i.posthog.com (script + worker), us.i.posthog.com (event ingest).
const ANALYTICS_SCRIPT = [
  "https://snap.licdn.com",
  "https://*.licdn.com",
  "https://www.clarity.ms",
  "https://*.clarity.ms",
  "https://us-assets.i.posthog.com",
  "https://*.i.posthog.com",
].join(' ')
const ANALYTICS_CONNECT = [
  "https://px.ads.linkedin.com",
  "https://*.linkedin.com",
  "https://*.licdn.com",
  "https://*.clarity.ms",
  "https://c.bing.com",
  "https://us.i.posthog.com",
  "https://us-assets.i.posthog.com",
  "https://*.i.posthog.com",
].join(' ')
const SCRIPT_SOURCES = `'self' 'unsafe-inline' 'unsafe-eval' ${WEBFLOW_CDN} https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com ${ANALYTICS_SCRIPT}`
const CSP = [
  "default-src 'self'",
  // script-src-elem covers <script src=...>; script-src is the legacy fallback
  // (older browsers + workers). Keep both in lockstep.
  `script-src ${SCRIPT_SOURCES}`,
  `script-src-elem ${SCRIPT_SOURCES}`,
  `style-src 'self' 'unsafe-inline' ${WEBFLOW_CDN} https://fonts.googleapis.com`,
  "img-src 'self' data: blob: https:",
  `font-src 'self' data: ${WEBFLOW_CDN} https://fonts.gstatic.com`,
  `connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.googletagmanager.com ${ANALYTICS_CONNECT}`,
  // PostHog session-replay uses a Web Worker hosted at us-assets.i.posthog.com.
  "worker-src 'self' blob: https://us-assets.i.posthog.com",
  "frame-src 'self' https://*.substack.com https://*.clarity.ms",
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
  // ── Native modules excluded from the prod bundle ──
  // better-sqlite3 is dev-only (local SQLite). It compiles native code via
  // node-gyp + Python, which Webflow Cloud's Linux build container doesn't
  // have, so we keep it out of the bundle entirely. The dynamic imports in
  // src/lib/db/client.ts and src/app/admin/seed/actions.ts are gated by
  // NODE_ENV !== 'production' and therefore never fire on Cloudflare.
  serverExternalPackages: ['better-sqlite3'],
  // ── Server Actions allowed origins ──
  // Webflow Cloud routes traffic through its own CDN: the worker sees
  // `x-forwarded-host: <uuid>.wf-app-prod.cosmic.webflow.services` while the
  // browser's Origin is `www.indianvcs.com`. Next.js's built-in CSRF guard for
  // Server Actions rejects this mismatch with "Invalid Server Actions request"
  // and refuses to invoke the action body at all. Listing the public hosts
  // explicitly tells Next.js to trust them as legitimate origins.
  experimental: {
    serverActions: {
      allowedOrigins: [
        'www.indianvcs.com',
        'indianvcs.com',
        '*.cosmic.webflow.services',
      ],
    },
  },
  // ── Dev escape hatch for iCloud-synced project paths ──
  // The repo lives under ~/Documents which macOS file-provider syncs to
  // iCloud. iCloud silently empties .next/dev/ mid-session, breaking every
  // request with manifest-not-found 500s. Setting NEXT_DIST_DIR to a path
  // outside ~/Documents keeps the build cache off iCloud's hands.
  //
  // Use a RELATIVE path (e.g. "../../.cache/vcstack-next" from this repo
  // resolves to ~/.cache/vcstack-next). Next.js 16 mishandles absolute
  // paths here — it treats them as project-relative and creates a literal
  // ./Users/pc/... tree inside the repo, defeating the whole purpose.
  //
  // No effect on prod: Webflow Cloud and OpenNext don't set this env var.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
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
