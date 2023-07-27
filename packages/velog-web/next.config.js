/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['velog.velcdn.com', 'images.velog.io', 'media.vlpt.us'],
  },
}

module.exports = nextConfig
