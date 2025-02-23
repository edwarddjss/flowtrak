/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'flowtrak.vercel.app', 'www.flowtrak.app'],
    },
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
    serverComponentsExternalPackages: [],
  },
  webpack: (config, { dev, isServer }) => {
    // Add resolve aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    }

    return config
  }
}

module.exports = nextConfig
