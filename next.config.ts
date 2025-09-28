import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // izinkan semua domain https
      },
      {
        protocol: "http",
        hostname: "**", // kalau ada gambar http
      },
    ],
  },
};

export default nextConfig;
