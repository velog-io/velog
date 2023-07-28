/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['velog.velcdn.com', 'images.velog.io', 'media.vlpt.us'],
  },
}

module.exports = nextConfig
