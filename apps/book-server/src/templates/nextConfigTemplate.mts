type Props = {
  bucketUrl: string
  deployCode: string
  urlSlug: string
}

export const nextConfigTempate = ({ bucketUrl, deployCode, urlSlug }: Props) => {
  return `
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
  
  const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true,
    },
    assetPrefix: process.env.NODE_ENV === 'production' ? 'https://books.velog.io${urlSlug}/${deployCode}' : undefined,
    basePath: '${urlSlug}/${deployCode}',
    trailingSlash: false
  }
  
  export default withNextra(nextConfig)
  
  `
}
