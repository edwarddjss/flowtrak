/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbotrace: {
      logLevel: 'error',
      memoryLimit: 4096
    }
  },
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
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  webpack: (config) => {
    // Enable source maps
    if (!config.optimization) {
      config.optimization = {}
    }
    config.optimization.minimize = true
    
    return config
  }
}

module.exports = nextConfig
