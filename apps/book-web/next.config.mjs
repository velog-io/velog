/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['next-mdx-remote'],
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['shiki', 'vscode-oniguruma'],
  },
}

export default nextConfig
