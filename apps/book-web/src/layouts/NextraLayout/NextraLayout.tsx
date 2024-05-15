import NextraDocLayout, { CustomEventDetail, nextraCustomEventName } from '@packages/nextra-editor'
import { themeConfig } from './context'
import { mdxCompiler } from '@/lib/mdx/compileMdx'
import { useEffect, useState } from 'react'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { BookMetadata } from '@/lib/generateBookMetadata'
import { useCreatePageMutation } from '@/graphql/bookServer/generated/bookServer'

type Props = {
  mdxSource: MDXRemoteSerializeResult
  children?: React.ReactNode
  bookMetadata: BookMetadata
  body: string
}

function NextraLayout({ mdxSource, children, body, bookMetadata }: Props) {
  const [editorValue, setEditorValue] = useState(body)
  const [source, setSource] = useState<MDXRemoteSerializeResult>(mdxSource)

  const { mutate: createPageMutate } = useCreatePageMutation()

  useEffect(() => {
    async function compileSource() {
      try {
        const result = await mdxCompiler(editorValue)
        setSource(result)
      } catch (error) {
        console.log('failed mdx compile: ', error)
      }
    }

    compileSource()
  }, [editorValue])

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorValue(e.target.value)
  }

  useEffect(() => {
    const addFile = async (e: CustomEventInit<CustomEventDetail['AddFileEventDetail']>) => {
      if (!e.detail) return
      console.log(e.detail)
      const { title, parentUrlSlug, index, bookUrlSlug } = e.detail
      createPageMutate({
        input: {
          title,
          parent_url_slug: parentUrlSlug,
          index,
          book_url_slug: bookUrlSlug,
          type: 'page',
        },
      })
    }

    window.addEventListener(nextraCustomEventName.addFile, addFile)
    return () => {
      window.removeEventListener(nextraCustomEventName.addFile, addFile)
    }
  })

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
