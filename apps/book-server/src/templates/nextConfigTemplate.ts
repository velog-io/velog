type Props = {
  bucketUrl: string
  bookId: string
}

export const nextConfigTempate = ({ bucketUrl, bookId }: Props) => {
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
    assetPrefix: process.env.NODE_ENV === 'production' ? '${bucketUrl}/${bookId}' : undefined,
  }
  
  export default withNextra(nextConfig)
  
  `
}
