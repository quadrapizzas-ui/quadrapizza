/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/dueño',
        destination: '/dueno',
      },
      {
        source: '/dueño/:path*',
        destination: '/dueno/:path*',
      },
    ];
  },
};
export default nextConfig;
