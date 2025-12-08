/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // protocol: process.env.IMG_PROTOCOL || 'http',
        // hostname: process.env.NEXT_PUBLIC_API_HOSTNAME || 'localhost',
        // port: process.env.NEXT_PUBLIC_API_PORT || '8000',
        // pathname: '/**',
		protocol: 'https',
        hostname: 'api.fashionshop.io.vn',
      },
    ],
  },
};

export default nextConfig;
