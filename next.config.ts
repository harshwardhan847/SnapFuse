import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://v3.fal.media/**"),
      new URL("https://third-impala-993.convex.cloud/**"),
    ],
  },
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // <- disables build failure on warnings or errors
  },
};

export default nextConfig;
