import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Concept imagery is served from Unsplash. When the restaurant's own
    // photography is added to /public/images, this entry can be removed.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
