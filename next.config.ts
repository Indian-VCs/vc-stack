import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Mount path ──
  // Change these to match your Webflow Cloud environment mount path
  // e.g. if mounted at /vc-stack → basePath: "/vc-stack"
  basePath: "/tech-stack",
  assetPrefix: "/tech-stack",
};

export default nextConfig;
