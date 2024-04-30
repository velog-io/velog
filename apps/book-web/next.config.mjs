/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      'node:module': false,
      module: false,
    }
    return config
  },
}

export default nextConfig
