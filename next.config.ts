import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  outputFileTracingExcludes: {
    "*": ["./backend/**"],
  },
};

export default nextConfig;
