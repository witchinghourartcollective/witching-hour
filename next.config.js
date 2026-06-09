const path = require("node:path");

/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;
