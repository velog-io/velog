const isStageContainer = process.env.DOCKER_ENV === 'stage'
const isProductionContainer = process.env.DOCKER_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['velog.velcdn.com', 'images.velog.io', 'media.vlpt.us'],
    unoptimized: true,
  },
  assetPrefix: isProductionContainer
    ? 'https://assets.velcdn.com'
    : isStageContainer
    ? 'https://assets-stage.velcdn.com'
    : undefined,
}

module.exports = nextConfig
