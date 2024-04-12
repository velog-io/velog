import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  latex: true,
  flexsearch: {
    codeblocks: true,
  },
  defaultShowCopyCode: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://assets.velog.io' : undefined,
  // skipTrailingSlashRedirect: true,
  // images: {
  //   loader: 'imgix',
  //   path: 'https://example.com/myaccount/',
  // },
}

export default withNextra(nextConfig)
