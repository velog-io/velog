import NextraDocLayout from '@packages/nextra-editor'
import { pageOpts, themeConfig } from './context'
import { mdxCompiler } from '@/lib/mdx/compileMdx'
import { useEffect, useState } from 'react'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { BookMetadata } from '@/lib/generateBookMetadata'

type Props = {
  mdxSource: MDXRemoteSerializeResult
  children?: React.ReactNode
  bookMetadata: BookMetadata
  body: string
}

function NextraLayout({ mdxSource, children, body, bookMetadata }: Props) {
  const [editorValue, setEditorValue] = useState(body)
  const [source, setSource] = useState<MDXRemoteSerializeResult>(mdxSource)

  useEffect(() => {
    async function compileSource() {
      try {
        const result = await mdxCompiler(editorValue)
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
      pageOpts={bookMetadata.pageOpts}
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
