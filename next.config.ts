import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en/",
        permanent: true,
      },
    ];
  },
  images: {
    dangerouslyAllowLocalIP: true,
    qualities: [75, 85, 90, 95],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gryvthrkxhstesaqrqur.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tvlswgjqqnhtytqmetxe.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "drive.usercontent.google.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "docs.google.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    cpus: 1,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
