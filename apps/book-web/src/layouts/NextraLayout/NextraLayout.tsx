import NextraDocLayout from '@packages/nextra-theme-docs'
import { pageOpts, themeConfig } from './context'
import { mdxCompiler } from '@/lib/mdx/compileMdx'
import { useEffect, useState } from 'react'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

type Props = {
  mdxSource: MDXRemoteSerializeResult
  children?: React.ReactNode
  body: string
}

function NextraLayout({ mdxSource, children, body }: Props) {
  const [editorValue, setEditorValue] = useState(body)
  const [source, setSource] = useState<MDXRemoteSerializeResult>(mdxSource)

  useEffect(() => {
    async function compileSource() {
      try {
        const result: MDXRemoteSerializeResult = await mdxCompiler(editorValue)
        setSource(result)
      } catch (error) {
        console.log('err', error)
      }
    }

    compileSource()
  }, [editorValue])

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorValue(e.target.value)
  }

  if (!source) {
    return <div>not found source Loading...</div>
  }

  return (
    <NextraDocLayout
      pageOpts={pageOpts}
      themeConfig={themeConfig}
      pageProps={{}}
      mdxSource={source}
      editorValue={editorValue}
      onEditorChange={onChange}
    >
      {children}
    </NextraDocLayout>
  )
}

export default NextraLayout
