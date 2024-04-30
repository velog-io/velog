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
  const [sourceString, setSourceString] = useState(body)
  const [source, setSource] = useState(mdxSource)

  useEffect(() => {
    async function compileSource() {
      try {
        if (!body) return
        const result: MdxCompilerResult = await mdxCompiler(body)
        console.log('result', result)

        setSource(result)
      } catch (error) {
        console.error(error)
      }
    }

    compileSource()
  }, [sourceString])

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
