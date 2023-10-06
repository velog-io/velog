/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['velog.velcdn.com', 'images.velog.io', 'media.vlpt.us'],
    unoptimized: true,
  },
}

module.exports = nextConfig
