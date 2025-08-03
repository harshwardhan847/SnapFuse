import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // <- disables build failure on warnings or errors
  },
};

export default nextConfig;
