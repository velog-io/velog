/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['shiki', 'vscode-oniguruma'],
  },
  webpack: (config) => {
    config.experiments.topLevelAwait = true
    return config
  },
}

export default nextConfig
