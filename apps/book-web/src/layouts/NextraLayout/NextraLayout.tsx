import NextraDocLayout, { CustomEventDetail, nextraCustomEventName } from '@packages/nextra-editor'
import { themeConfig } from './context'
import { mdxCompiler } from '@/lib/mdx/compileMdx'
import { useEffect, useState } from 'react'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { BookMetadata, generateBookMetadata } from '@/lib/generateBookMetadata'
import { useCreatePageMutation, useGetPagesQuery } from '@/graphql/bookServer/generated/bookServer'
import { useUrlSlug } from '@/hooks/useUrlSlug'

type Props = {
  mdxSource: MDXRemoteSerializeResult
  children?: React.ReactNode
  body: string
}

function NextraLayout({ mdxSource, children, body }: Props) {
  const { bookUrlSlug } = useUrlSlug()
  const {
    data: getPagesData,
    refetch: getPagesRefetch,
    isLoading,
  } = useGetPagesQuery({ input: { book_url_slug: bookUrlSlug } })

  const [editorValue, setEditorValue] = useState(body)
  const [bookMetadata, setBookMetadata] = useState<BookMetadata | null>(null)
  const [source, setSource] = useState<MDXRemoteSerializeResult>(mdxSource)

  const { mutateAsync: createPageAsyncMutate } = useCreatePageMutation()

  useEffect(() => {
    if (!getPagesData?.pages) return
    const metadata = generateBookMetadata({ pages: getPagesData.pages, bookUrl: bookUrlSlug })
    setBookMetadata(metadata)
  }, [getPagesData?.pages])

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

  useEffect(() => {
    const addFile = async (e: CustomEventInit<CustomEventDetail['AddFileEventDetail']>) => {
      if (!e.detail) return
      const { title, parentUrlSlug, index, bookUrlSlug } = e.detail
      await createPageAsyncMutate({
        input: {
          title,
          parent_url_slug: parentUrlSlug,
          index,
          book_url_slug: bookUrlSlug,
          type: 'page',
        },
      })
      getPagesRefetch()
    }

    window.addEventListener(nextraCustomEventName.addFile, addFile)
    return () => {
      window.removeEventListener(nextraCustomEventName.addFile, addFile)
    }
  })

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorValue(e.target.value)
  }

  if (!source) {
    return <div>not found source Loading...</div>
  }

  if (isLoading || !bookMetadata) return <div>loading...</div>
  return (
    <NextraDocLayout
      pageOpts={bookMetadata!.pageOpts}
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
