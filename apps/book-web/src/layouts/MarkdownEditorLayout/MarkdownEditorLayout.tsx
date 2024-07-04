import { MarkdownEditor, CustomEventDetail, nextraCustomEventName } from '@packages/markdown-editor'
import { themeConfig } from './context'
import { useEffect, useState } from 'react'
import { BookMetadata, generateBookMetadata, Pages } from '@/lib/generateBookMetadata'
import {
  useBuildMutation,
  useCreatePageMutation,
  useDeployMutation,
  useGetPageQuery,
  useGetPagesQuery,
  useReorderPageMutation,
  useUpdatePageMutation,
} from '@/graphql/bookServer/generated/bookServer'
import { useUrlSlug } from '@/hooks/useUrlSlug'

type Props = {
  children?: React.ReactNode
  mdxText: string
}

function MarkdownEditorLayout({ children, mdxText }: Props) {
  const { bookUrlSlug, pageUrlSlug } = useUrlSlug()
  const [bookMetadata, setBookMetadata] = useState<BookMetadata | null>(null)
  const [mdx, setMdx] = useState<string>(mdxText)

  const { mutateAsync: createPageAsyncMutate, isPending: isCreatePagePending } =
    useCreatePageMutation()
  const { mutateAsync: reorderAsyncMutate, isPending: isReorderPagePending } =
    useReorderPageMutation()
  const { mutateAsync: updatePageAsyncMutate, isPending: isUpdatePagePending } =
    useUpdatePageMutation()
  const { mutateAsync: buildAsyncMutate, isPending: isBuildPending } = useBuildMutation()
  const { mutateAsync: deployAsyncMutate, isPending: isDeployPending } = useDeployMutation()

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

  // 페이지 변경시 item 데이터 불러오기
  useEffect(() => {
    getPageRefetch()
  }, [pageUrlSlug])

  // new Mdx
  useEffect(() => {
    if (isGetPageLoading) return
    if (!getPageData?.page) return
    if (typeof getPageData.page?.body !== 'string') return
    setMdx(getPageData.page.body)
  }, [getPageData, isGetPageLoading])

  // create or update item
  useEffect(() => {
    const createOrUpdate = async (
      e: CustomEventInit<CustomEventDetail['createOrUpdateItemEvent']>,
    ) => {
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
    window.addEventListener(nextraCustomEventName.createOrUpdateItemEvent, createOrUpdate)
    return () => {
      window.removeEventListener(nextraCustomEventName.createOrUpdateItemEvent, createOrUpdate)
    }
  })

  // change Item order
  useEffect(() => {
    const changeItem = async (e: CustomEventInit<CustomEventDetail['changeItemOrderEvent']>) => {
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
      getPagesRefetch()
    }

    window.addEventListener(nextraCustomEventName.changeItemOrderEvent, changeItem)
    return () => {
      window.removeEventListener(nextraCustomEventName.changeItemOrderEvent, changeItem)
    }
  }, [])

  // saveItemBody
  useEffect(() => {
    if (isUpdatePagePending) {
      //TODO: show loading
      return
    }
    const saveItemBody = async (e: CustomEventInit<CustomEventDetail['saveItemBodyEvent']>) => {
      if (!e.detail) return
      const { body } = e.detail

      await updatePageAsyncMutate({
        input: {
          book_url_slug: bookUrlSlug,
          page_url_slug: pageUrlSlug,
          body,
        },
      })

      getPageRefetch()
    }

    window.addEventListener(nextraCustomEventName.saveItemBodyEvent, saveItemBody)
    return () => {
      window.removeEventListener(nextraCustomEventName.saveItemBodyEvent, saveItemBody)
    }
  }, [pageUrlSlug])

  // deploy start and dispatch deploy end event
  useEffect(() => {
    const deployStart = async () => {
      const { build } = await buildAsyncMutate({ input: { url_slug: bookUrlSlug } })
      if (!build.result) {
        //TODO: show error
        return
      }
      const { deploy } = await deployAsyncMutate({ input: { url_slug: bookUrlSlug } })

      const event = new CustomEvent(nextraCustomEventName.deployEndEvent, {
        detail: { publishedUrl: deploy.published_url },
      })
      window.dispatchEvent(event)
    }

    window.addEventListener(nextraCustomEventName.deployStartEvent, deployStart)
    return () => {
      window.removeEventListener(nextraCustomEventName.deployStartEvent, deployStart)
    }
  }, [])

  useEffect(() => {
    const deleteItemStart = async (
      e: CustomEventInit<CustomEventDetail['deleteItemStartEvent']>,
    ) => {
      if (!e.detail) return
      console.log('isDetail', e.detail)
    }

    window.addEventListener(nextraCustomEventName.deleteItemStartEvent, deleteItemStart)
    return () => {
      window.removeEventListener(nextraCustomEventName.deleteItemStartEvent, deleteItemStart)
    }
  }, [])

  if (isGetPagesLoading || !bookMetadata) return <div>loading...</div>

  return (
    <MarkdownEditor
      editorValue={mdx}
      pageOpts={bookMetadata!.pageOpts}
      themeConfig={themeConfig}
      pageProps={{}}
    >
      {children}
    </MarkdownEditor>
  )
}

export default MarkdownEditorLayout