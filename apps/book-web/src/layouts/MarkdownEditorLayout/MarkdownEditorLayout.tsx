import {
  MarkdownEditor,
  CustomEventDetail,
  markdownCustomEventName,
} from '@packages/markdown-editor'
import { themeConfig } from './context'
import { useEffect, useState } from 'react'
import { BookMetadata, generateBookMetadata, Pages } from '@/lib/generateBookMetadata'
import {
  DeployCompletedDocument,
  DeployCompletedPayload,
  useBuildMutation,
  useCreatePageMutation,
  useDeletePageMutation,
  useDeployMutation,
  useGetPageQuery,
  useGetPagesQuery,
  useIsDeployQuery,
  useReorderPageMutation,
  useUpdatePageMutation,
} from '@/graphql/bookServer/generated/bookServer'
import { useUrlSlug } from '@/hooks/useUrlSlug'
import { useSubscription } from 'urql'

type Props = {
  children?: React.ReactNode
  mdxText: string
}

function MarkdownEditorLayout({ children, mdxText }: Props) {
  const { bookUrlSlug, pageUrlSlug } = useUrlSlug()
  const [bookMetadata, setBookMetadata] = useState<BookMetadata | null>(null)
  const [mdx, setMdx] = useState<string>(mdxText)

  const { mutateAsync: createPageAsyncMutate, isPending: isCreatePending } = useCreatePageMutation()
  const { mutateAsync: reorderAsyncMutate, isPending: isReorderPending } = useReorderPageMutation()
  const { mutateAsync: updatePageAsyncMutate, isPending: isUpdatePending } = useUpdatePageMutation()
  const { mutateAsync: buildAsyncMutate } = useBuildMutation()
  const { mutateAsync: deployAsyncMutate } = useDeployMutation()
  const { mutateAsync: deletePageAsyncMutate } = useDeletePageMutation()

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

  const [deployCompleted] = useSubscription<DeployCompletedPayload>({
    query: DeployCompletedDocument,
    variables: { input: { book_url_slug: bookUrlSlug } },
  })

  // 재접속시에 deploy 결과 확인
  useEffect(() => {
    if (!deployCompleted.data) return
    console.log(deployCompleted)
    const { published_url } = deployCompleted.data
    if (published_url) {
      console.log('published_url in client', published_url)
      const event = new CustomEvent(markdownCustomEventName.deployEndEvent, {
        detail: { publishedUrl: published_url },
      })
      window.dispatchEvent(event)
    }
  }, [deployCompleted])

  const { data: isDeployData } = useIsDeployQuery({
    input: {
      book_url_slug: bookUrlSlug,
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

  // new Page data
  useEffect(() => {
    if (isGetPageLoading) return
    if (!getPageData?.page) return
    if (typeof getPageData.page?.body !== 'string') return
    setMdx(getPageData.page.body)
  }, [getPageData, isGetPageLoading])

  // create item
  useEffect(() => {
    if (isCreatePending) return
    const create = async (e: CustomEventInit<CustomEventDetail['createItemEvent']>) => {
      if (!e.detail) return
      const { title, parentUrlSlug, index, bookUrlSlug, type } = e.detail
      await createPageAsyncMutate({
        input: {
          title,
          parent_url_slug: parentUrlSlug,
          book_url_slug: bookUrlSlug,
          index,
          type,
        },
      })
      getPagesRefetch()
    }
    window.addEventListener(markdownCustomEventName.createItemEvent, create)
    return () => {
      window.removeEventListener(markdownCustomEventName.createItemEvent, create)
    }
  }, [])

  // update item
  useEffect(() => {
    if (isUpdatePending) return
    const update = async (e: CustomEventInit<CustomEventDetail['updateItemEvent']>) => {
      if (!e.detail) return
      const bodyInput = {
        book_url_slug: bookUrlSlug,
        page_url_slug: pageUrlSlug,
        body: e.detail?.body,
      }

      const titleInput = {
        book_url_slug: bookUrlSlug,
        page_url_slug: e.detail.pageUrlSlug ?? '',
        title: e.detail.title,
      }

      const isUpdateTitle = !!e.detail.title

      try {
        await updatePageAsyncMutate({
          input: isUpdateTitle ? titleInput : bodyInput,
        })

        const event = new CustomEvent(markdownCustomEventName.updateItemResultEvent, {
          detail: { result: 'success' },
        })
        dispatchEvent(event)
      } catch (error) {
        const event = new CustomEvent(markdownCustomEventName.updateItemResultEvent, {
          detail: { result: 'error' },
        })
        dispatchEvent(event)
      }

      getPageRefetch()

      if (isUpdateTitle) {
        getPagesRefetch()
      }
    }

    window.addEventListener(markdownCustomEventName.updateItemEvent, update)
    return () => {
      window.removeEventListener(markdownCustomEventName.updateItemEvent, update)
    }
  }, [pageUrlSlug, bookUrlSlug])

  // change Item order
  useEffect(() => {
    const changeItem = async (e: CustomEventInit<CustomEventDetail['changeItemOrderEvent']>) => {
      if (!e.detail) return
      if (isReorderPending) return

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

    window.addEventListener(markdownCustomEventName.changeItemOrderEvent, changeItem)
    return () => {
      window.removeEventListener(markdownCustomEventName.changeItemOrderEvent, changeItem)
    }
  }, [])

  // deploy start and dispatch deploy end event
  useEffect(() => {
    const deployStart = async () => {
      const { build } = await buildAsyncMutate({ input: { book_url_slug: bookUrlSlug } })

      if (!build.result) {
        //TODO: show error
        return
      }
      const { deploy } = await deployAsyncMutate({ input: { book_url_slug: bookUrlSlug } })
      const event = new CustomEvent(markdownCustomEventName.deployEndEvent, {
        detail: { publishedUrl: deploy.published_url },
      })
      window.dispatchEvent(event)
    }

    window.addEventListener(markdownCustomEventName.deployStartEvent, deployStart)
    return () => {
      window.removeEventListener(markdownCustomEventName.deployStartEvent, deployStart)
    }
  }, [bookUrlSlug])

  // deleteItem
  useEffect(() => {
    const deleteItemStart = async (e: CustomEventInit<CustomEventDetail['deleteItemEvent']>) => {
      if (!e.detail) return
      await deletePageAsyncMutate({
        input: {
          page_url_slug: e.detail.pageUrlSlug,
          book_url_slug: bookUrlSlug,
        },
      })
      getPagesRefetch()
    }
    window.addEventListener(markdownCustomEventName.deleteItemEvent, deleteItemStart)
    return () => {
      window.removeEventListener(markdownCustomEventName.deleteItemEvent, deleteItemStart)
    }
  }, [bookUrlSlug])

  // check isDeploying...
  useEffect(() => {
    if (!isDeployData) return
    const dispatchDeployEvent = () => {
      const event = new CustomEvent(markdownCustomEventName.checkIsDeployEvent, {
        detail: {
          isDeploy: isDeployData.isDeploy,
        },
      })
      window.dispatchEvent(event)
    }

    const timeoutId = setTimeout(dispatchDeployEvent, 200)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [bookUrlSlug, isDeployData])

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
