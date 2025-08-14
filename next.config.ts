// next.config.ts
import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
    // If you ever use next/image with external hosts, add:
    // domains: ['assets.stripe.com', 'firebasestorage.googleapis.com'],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  async redirects() {
    return [
      {
        source: '/blog',
        destination: 'https://www.linkedin.com/in/rewmoai/recent-activity/newsletter/',
        permanent: false, // keep temporary while you iterate
      },
      {
        source: '/privacy',
        destination: 'https://rewmo.ai/privacy',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
