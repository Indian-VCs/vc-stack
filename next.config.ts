import type { NextConfig } from "next";

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
};

export default nextConfig;
