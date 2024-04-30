import NextraDocLayout from '@packages/nextra-theme-docs'
import { pageOpts, themeConfig } from './context'
import { mdxCompiler, type MdxCompilerResult } from '@/lib/mdx/compileMdx'
import { useEffect, useState } from 'react'

type Props = {
  mdxSource: MdxCompilerResult
  children?: React.ReactNode
  body?: string
}

function NextraLayout({ mdxSource, children, body }: Props) {
  const [source, setSource] = useState(mdxSource)
  useEffect(() => {
    if (!body) return
    mdxCompiler(body).then((result) => {
      // setSource(result)
    })
  }, [])

  if (!source) return <div> loading</div>
  return (
    <NextraDocLayout
      pageOpts={pageOpts}
      themeConfig={themeConfig}
      pageProps={{}}
      mdxSource={source}
    >
      {children}
    </NextraDocLayout>
  )
}

export default NextraLayout
