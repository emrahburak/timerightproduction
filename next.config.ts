import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.timerightproduction.org',
      },
      {
        protocol: 'https',
        hostname: 'timerightproduction.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
