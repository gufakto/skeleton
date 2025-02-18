import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_CONTAINER || "http://localhost:3000",
  },
  experimental: {
    turbo: {
      minify: true,
    }
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
