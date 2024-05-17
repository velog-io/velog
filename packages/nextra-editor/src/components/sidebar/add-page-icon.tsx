import { useSidebar } from '../../contexts/sidebar'
import { NewPageIcon } from '../../nextra/icons/new-page'
import { useEffect, useRef, useState } from 'react'
import { Folder, PageMapItem } from '../../nextra/types'
import { findFolder } from './utils'
import { useUrlSlug } from '../../hooks/use-url-slug'

type Props = {
  className?: string
}

const AddFileIcon = ({ className }: Props) => {
  const sidebar = useSidebar()
  const { bookUrlSlug, pageUrlSlug, fullUrlSlug } = useUrlSlug()

  const timeoutRef = useRef<NodeJS.Timeout>()
  const [originPageMap, setOriginPageMap] = useState<PageMapItem[]>([])

  useEffect(() => {
    if (!sidebar.actionComplete) return
    sidebar.reset(originPageMap)
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [sidebar.actionComplete])

  const onClickAddFileIcon = () => {
    if (sidebar.actionActive) {
      sidebar.reset(originPageMap)
      return
    }
    const timeout = setTimeout(() => sidebar.setActionActive(true), 100)
    timeoutRef.current = timeout

    // remove code
    let targetRoute = `/${pageUrlSlug.split('-').slice(0, -1).join('-').trim()}`
    const isFolder = !!findFolder(sidebar.pageMap, fullUrlSlug)

    // 폴더 타입이 아닐 경우 부모 폴더로 targetRoute를 변경
    if (!isFolder) {
      targetRoute = targetRoute.split('/').slice(0, -1).join('/') || '/'
    }

    setOriginPageMap(sidebar.pageMap)

    const coppeidPageMap = structuredClone(sidebar.pageMap)

    function addNewPageToPageMap(pageMap: PageMapItem[], parent?: Folder) {
      for (const page of pageMap) {
        const isMdxPage = page.kind === 'MdxPage'
        if (isMdxPage) continue

        const isMetaPage = page.kind === 'Meta'
        const isFolderPage = page.kind === 'Folder'

        if (isFolderPage && page.children.length > 0) {
          addNewPageToPageMap(page.children, page)
          continue
        }

        if (!isMetaPage) continue

        const isTarget = page.route === targetRoute
        if (isTarget) {
          const key = Math.random().toString(36).substring(7).slice(0, 9)
          const newPageData = { ...page.data, [key]: { title: key, type: 'newPage' } }
          const removeBookUrlSlug = parent?.route.replace(bookUrlSlug, '')
          sidebar.setActionInfo({
            parentUrlSlug: removeBookUrlSlug ?? '',
            index: Object.keys(newPageData).length - 1,
            bookUrlSlug,
            type: 'page',
          })

          page.data = newPageData
          sidebar.setPageMap(coppeidPageMap)
          break
        }
      }
    }

    addNewPageToPageMap(coppeidPageMap)
  }

  return (
    <span className={className} onClick={onClickAddFileIcon}>
      <NewPageIcon />
    </span>
  )
}

export default AddFileIcon
