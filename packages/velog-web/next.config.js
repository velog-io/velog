const isProd = process.env.NODE_ENV === 'production'
// const isStage = process.env.NODE_ENV === 'stage'
// https://assets-stage.velcdn.com/

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['velog.velcdn.com', 'images.velog.io', 'media.vlpt.us'],
    unoptimized: true,
  },
  assetPrefix: isProd ? 'https://assets.velcdn.com' : undefined,
}

module.exports = nextConfig
