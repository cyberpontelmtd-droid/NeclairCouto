import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: ["neclaircouto.com.br", "www.neclaircouto.com.br"],
    },
  },
};

export default nextConfig;
