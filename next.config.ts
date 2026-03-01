import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Mount path ──
  // Change these to match your Webflow Cloud environment mount path
  // e.g. if mounted at /vc-stack → basePath: "/vc-stack"
  basePath: "/vc-stack",
  assetPrefix: "/vc-stack",
};

export default nextConfig;
