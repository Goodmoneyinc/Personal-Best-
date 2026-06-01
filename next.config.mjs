/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: process.env.NEXT_OUTPUT === 'export',
  },
  trailingSlash: process.env.NEXT_OUTPUT === 'export',
  output: process.env.NEXT_OUTPUT === 'export' ? 'export' : undefined,
};

export default nextConfig;
