import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Build worker can hang in constrained/sandboxed environments; disable for reliability.
    webpackBuildWorker: false
  },
  turbopack: {
    root: path.join(__dirname)
  },
  images: {
    unoptimized: true
  }
};

export default nextConfig;
