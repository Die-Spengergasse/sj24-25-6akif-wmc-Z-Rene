/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.f-online.at',
      },
    ],
  },
};

module.exports = nextConfig;
