/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    turbo: {
      rules: {
        '.svg': ['@svgr/webpack'],
      },
    },
  },
}

module.exports = nextConfig
