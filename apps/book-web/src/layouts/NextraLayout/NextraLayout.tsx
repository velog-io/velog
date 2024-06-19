import NextraDocLayout, {
  CustomEventDetail,
  mdxCompiler,
  nextraCustomEventName,
} from '@packages/nextra-editor'
import { themeConfig } from './context'
import { useEffect, useState } from 'react'
import { BookMetadata, generateBookMetadata, Pages } from '@/lib/generateBookMetadata'
import {
  useCreatePageMutation,
  useGetPageQuery,
  useGetPagesQuery,
  useReorderPageMutation,
} from '@/graphql/bookServer/generated/bookServer'
import { useUrlSlug } from '@/hooks/useUrlSlug'

type Props = {
  children?: React.ReactNode
  mdxText: string
}

function NextraLayout({ children, mdxText }: Props) {
  const { bookUrlSlug, pageUrlSlug } = useUrlSlug()
  const [bookMetadata, setBookMetadata] = useState<BookMetadata | null>(null)
  const [mdx, setMdx] = useState<string>(mdxText)

  const { mutateAsync: createPageAsyncMutate, isPending: isCreatePagePending } =
    useCreatePageMutation()
  const { mutateAsync: reorderAsyncMutate, isPending: isReorderPagePending } =
    useReorderPageMutation()

  const {
    data: getPagesData,
    refetch: getPagesRefetch,
    isLoading: isGetPagesLoading,
  } = useGetPagesQuery({ input: { book_url_slug: bookUrlSlug } })

  const {
    data: getPageData,
    refetch: getPageRefetch,
    isLoading: isGetPageLoading,
  } = useGetPageQuery({
    input: {
      book_url_slug: bookUrlSlug,
      page_url_slug: pageUrlSlug,
    },
  })

  useEffect(() => {
    if (!getPagesData?.pages) return
    const metadata = generateBookMetadata({
      pages: getPagesData.pages as Pages,
      bookUrl: bookUrlSlug,
    })
    setBookMetadata(metadata)
  }, [getPagesData?.pages])

  useEffect(() => {
    getPageRefetch()
  }, [pageUrlSlug])

  useEffect(() => {
    if (isGetPageLoading) return
    if (!getPageData?.page) return
    if (!getPageData.page?.body) return
    setMdx(getPageData.page.body)
  }, [getPageData, isGetPageLoading])

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

  if (isGetPagesLoading || !bookMetadata || !mdxText) return <div>loading...</div>
  return (
    <NextraDocLayout
      editorValue={mdx}
      pageOpts={bookMetadata!.pageOpts}
      themeConfig={themeConfig}
      pageProps={{}}
    >
      {children}
    </NextraDocLayout>
  )
}

export default NextraLayout
