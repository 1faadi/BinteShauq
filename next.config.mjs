/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/sidebar/:slug",
        destination: "/collections/:slug",
        permanent: true,
      },
    ]
  },
  serverExternalPackages: ["@prisma/client", "pdfkit"],
}

export default nextConfig
