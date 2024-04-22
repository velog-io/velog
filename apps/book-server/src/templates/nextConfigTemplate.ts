type Props = {
  bucketUrl: string
  penName: string
  urlSlug: string
}

export const nextConfigTempate = ({ bucketUrl, penName, urlSlug }: Props) => {
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
    assetPrefix: process.env.NODE_ENV === 'production' ? '${bucketUrl}/@${penName}/${urlSlug}' : undefined,
    basePath: '/@${penName}/${urlSlug}',
    trailingSlash: false
  }
  
  export default withNextra(nextConfig)
  
  `
}
