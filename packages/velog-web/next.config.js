const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['velog.velcdn.com', 'images.velog.io', 'media.vlpt.us'],
    unoptimized: true,
  },
  // assetPrefix: isProd ? 'https://assets.velcdn.com' : undefined,
  assetPrefix: isProd ? 'https://assets-stage.velcdn.com' : undefined,
}

module.exports = nextConfig
