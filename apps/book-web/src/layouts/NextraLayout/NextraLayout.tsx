import NextraDocLayout from '@packages/nextra-theme-docs'
import { pageOpts, themeConfig } from './context'
import { mdxCompiler, type MdxCompilerResult } from '@/lib/mdx/compileMdx'
import { useEffect, useState } from 'react'

type Props = {
  mdxSource: MdxCompilerResult
  children?: React.ReactNode
  body: string
}

function NextraLayout({ mdxSource, children, body }: Props) {
  const [editorBody, setEditorBody] = useState(body)
  const [source, setSource] = useState(mdxSource)

  useEffect(() => {
    async function compileSource() {
      try {
        // const result: MdxCompilerResult = await mdxCompiler(editorBody)
        // console.log(result)
        // setSource(result)
      } catch (error) {
        console.log('err', error)
      }
    }

    // compileSource()
  }, [editorBody])

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorBody(e.target.value)
  }

  if (!source) {
    return <div>not found source Loading...</div>
  }

  return (
    <NextraDocLayout
      pageOpts={pageOpts}
      themeConfig={themeConfig}
      pageProps={{}}
      mdxSource={mdxSource}
      editorValue={''}
      onEditorChange={onChange}
    >
      {children}
    </NextraDocLayout>
  )
}

export default NextraLayout
