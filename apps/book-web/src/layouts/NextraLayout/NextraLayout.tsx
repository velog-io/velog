import NextraDocLayout from '@packages/nextra-theme-docs'
import { pageOpts, themeConfig } from './context'
import type { MdxCompilerResult } from '@/lib/mdx/compileMdx'

type Props = {
  mdxSource: MdxCompilerResult
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
