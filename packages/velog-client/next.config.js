/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  // experimental: {
  //   turbo: {
  //     rules: { '.svg': ['@svgr/webpack'] },
  //   },
  // },
}

module.exports = nextConfig
