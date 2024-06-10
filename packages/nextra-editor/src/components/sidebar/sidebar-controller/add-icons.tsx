import { useEffect, useRef, useState } from 'react'
import { useSidebar } from '@/contexts/sidebar'
import { NewFolderIcon } from '@/nextra/icons/new-folder'
import { Folder, PageMapItem } from '@/nextra/types'
import { useUrlSlug } from '@/hooks/use-url-slug'
import { findFolder } from '../utils'
import { NewPageIcon } from '@/nextra/icons/new-page'
import { SeparatorIcon } from '@/nextra/icons/separator'
import { removeCodeFromRoute } from '@/utils'

type Props = {
  className: string
  type: 'page' | 'folder' | 'separator'
}

const AddIcons = ({ className, type }: Props) => {
  const sidebar = useSidebar()
  const { bookUrlSlug, pageUrlSlug, fullUrlSlug } = useUrlSlug()

  const timeoutRef = useRef<NodeJS.Timeout>()
  const [originPageMap, setOriginPageMap] = useState<PageMapItem[]>([])

  useEffect(() => {
    if (sidebar.actionType !== type) return
    if (!sidebar.actionComplete) return
    sidebar.reset(originPageMap)
    return () => {
      if (!timeoutRef.current) return
      clearTimeout(timeoutRef.current)
    }
  }, [sidebar.actionComplete])

  const onClick = () => {
    if (sidebar.actionActive) {
      sidebar.reset(originPageMap)
      return
    }

    sidebar.setActionType(type)

    const timeout = setTimeout(() => sidebar.setActionActive(true), 100)
    timeoutRef.current = timeout

    // remove code
    let targetRoute = `/${removeCodeFromRoute(pageUrlSlug)}`
    const isFolder = !!findFolder(sidebar.pageMap, fullUrlSlug)

    // 폴더 타입이 아닐 경우 부모 폴더로 targetRoute를 변경
    if (!isFolder) {
      targetRoute = targetRoute.split('/').slice(0, -1).join('/') || '/'
    }

    setOriginPageMap(sidebar.pageMap)

    const coppeidPageMap = structuredClone(sidebar.pageMap)

    function addNewFolderToPageMap(pageMap: PageMapItem[], parent?: Folder) {
      for (const page of pageMap) {
        const isMdxPage = page.kind === 'MdxPage'
        if (isMdxPage) continue

        const isMetaPage = page.kind === 'Meta'
        const isFolderPage = page.kind === 'Folder'

        if (isFolderPage && page.children.length > 0) {
          addNewFolderToPageMap(page.children, page)
          continue
        }

        if (!isMetaPage) continue

        const isTarget = page.route === targetRoute
        if (isTarget) {
          const key = Math.random().toString(36).substring(7).slice(0, 9)
          const pageTypeMap = {
            page: 'newPage',
            folder: 'newFolder',
            separator: 'newSeparator',
          }

          const newPageType = pageTypeMap[type]
          const newPageData = { ...page.data, [key]: { title: key, type: newPageType } }

          const removeBookUrlSlug = parent?.route.replace(bookUrlSlug, '')
          sidebar.setActionInfo({
            parentUrlSlug: removeBookUrlSlug ?? '',
            index: Object.keys(newPageData).length - 1,
            bookUrlSlug,
            type,
          })

          page.data = newPageData
          sidebar.setPageMap(coppeidPageMap)
          break
        }
      }
    }

    addNewFolderToPageMap(coppeidPageMap)
  }
  return (
    <span className={className} onClick={onClick}>
      {type === 'page' && <NewPageIcon />}
      {type === 'folder' && <NewFolderIcon />}
      {type === 'separator' && <SeparatorIcon />}
    </span>
  )
}

export default AddIcons
