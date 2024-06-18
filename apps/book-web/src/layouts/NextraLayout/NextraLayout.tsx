import NextraDocLayout, { CustomEventDetail, nextraCustomEventName } from '@packages/nextra-editor'
import { themeConfig } from './context'
import { useEffect, useState } from 'react'
import { BookMetadata, generateBookMetadata, Pages } from '@/lib/generateBookMetadata'
import {
  useCreatePageMutation,
  useGetPagesQuery,
  useReorderPageMutation,
} from '@/graphql/bookServer/generated/bookServer'
import { useUrlSlug } from '@/hooks/useUrlSlug'

type Props = {
  children?: React.ReactNode
  body: string
}

function NextraLayout({ children, body }: Props) {
  const { bookUrlSlug } = useUrlSlug()
  const [bookMetadata, setBookMetadata] = useState<BookMetadata | null>(null)
  const { mutateAsync: createPageAsyncMutate, isPending: isCreatePagePending } =
    useCreatePageMutation()
  const { mutateAsync: reorderAsyncMutate, isPending: isReorderPagePending } =
    useReorderPageMutation()
  const {
    data: getPagesData,
    refetch: getPagesRefetch,
    isLoading,
  } = useGetPagesQuery({ input: { book_url_slug: bookUrlSlug } })

  useEffect(() => {
    if (!getPagesData?.pages) return
    const metadata = generateBookMetadata({
      pages: getPagesData.pages as Pages,
      bookUrl: bookUrlSlug,
    })
    setBookMetadata(metadata)
  }, [getPagesData?.pages])

  useEffect(() => {
    const addAction = async (e: CustomEventInit<CustomEventDetail['addActionEvent']>) => {
      if (!e.detail) return
      if (isReorderPagePending) return
      const { title, parentUrlSlug, index, bookUrlSlug, type } = e.detail
      await createPageAsyncMutate({
        input: {
          title,
          parent_url_slug: parentUrlSlug,
          index,
          book_url_slug: bookUrlSlug,
          type: type,
        },
      })
      getPagesRefetch()
    }
    window.addEventListener(nextraCustomEventName.addAction, addAction)
    return () => {
      window.removeEventListener(nextraCustomEventName.addAction, addAction)
    }
  })

  useEffect(() => {
    const changeItem = async (e: CustomEventInit<CustomEventDetail['changeItemEvent']>) => {
      if (!e.detail) return
      if (isCreatePagePending) return

      const { bookUrlSlug, targetUrlSlug, parentUrlSlug, index } = e.detail

      await reorderAsyncMutate({
        input: {
          book_url_slug: bookUrlSlug,
          target_url_slug: targetUrlSlug,
          parent_url_slug: parentUrlSlug,
          index,
        },
      })
    }

    window.addEventListener(nextraCustomEventName.changeItem, changeItem)
    return () => {
      window.removeEventListener(nextraCustomEventName.changeItem, changeItem)
    }
  }, [])

  if (isLoading || !bookMetadata || !body) return <div>loading...</div>
  return (
    <NextraDocLayout
      editorValue={body}
      pageOpts={bookMetadata!.pageOpts}
      themeConfig={themeConfig}
      pageProps={{}}
    >
      {children}
    </NextraDocLayout>
  )
}

export default NextraLayout
