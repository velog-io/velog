import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  latex: true,
  flexsearch: {
    codeblocks: false,
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
  // skipTrailingSlashRedirect: true,
  distDir: 'dist',
  // images: {
  //   loader: 'imgix',
  //   path: 'https://example.com/myaccount/',
  // },
}

export default withNextra(nextConfig)
