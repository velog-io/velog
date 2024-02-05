const isProductionContainer = process.env.DOCKER_ENV === 'production'
const isStageContainer = process.env.DOCKER_ENV === 'stage'

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
  experimental: {
    esmExternals: true, // support esm
    taint: true, // for security
  },
}

export default nextConfig
