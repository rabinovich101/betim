import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // This will create a minimal standalone build for Docker
  // that includes only necessary files for production
};

export default nextConfig;
