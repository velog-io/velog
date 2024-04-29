import NextraDocLayout from '@packages/nextra-theme-docs'
import { pageOpts, themeConfig } from './context'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

type Props = {
  mdxSource: MDXRemoteSerializeResult
  children?: React.ReactNode
}

function NextraLayout({ mdxSource, children }: Props) {
  return (
    <NextraDocLayout
      pageOpts={pageOpts}
      themeConfig={themeConfig}
      pageProps={{}}
      mdxSource={mdxSource}
    >
      {children}
    </NextraDocLayout>
  )
}

export default NextraLayout
