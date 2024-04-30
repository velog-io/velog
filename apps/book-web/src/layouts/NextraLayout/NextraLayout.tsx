import NextraDocLayout from '@packages/nextra-theme-docs'
import { pageOpts, themeConfig } from './context'
import { mdxCompiler, type MdxCompilerResult } from '@/lib/mdx/compileMdx'

type Props = {
  mdxSource: MdxCompilerResult
  children?: React.ReactNode
}

function NextraLayout({ mdxSource, children }: Props) {
  const a = mdxCompiler('#Hello World')
  console.log('a', a)
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
