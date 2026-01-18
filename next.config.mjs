/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Move serverComponentsExternalPackages to the correct location
  serverExternalPackages: ['@prisma/client'],
  // Remove api config as it's not valid in Next.js 15
}

export default nextConfig
