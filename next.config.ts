import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets-in-gm.bmscdn.com',
      },
      {
        protocol: 'https',
        hostname: 'assets-in.bmscdn.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
