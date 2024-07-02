import { useEffect, useRef, useState } from 'react'
import { useSidebar } from '@/contexts/sidebar'
import { NewFolderIcon } from '@/nextra/icons/new-folder'
import { useUrlSlug } from '@/hooks/use-url-slug'
import { NewPageIcon } from '@/nextra/icons/new-page'
import { SeparatorIcon } from '@/nextra/icons/separator'
import { findFolder } from './utils'
import type { SortableItem } from '@/nextra/normalize-pages'

type Props = {
  className: string
  type: 'page' | 'folder' | 'separator'
}

const ControlIcon = ({ className, type }: Props) => {
  const sidebar = useSidebar()
  const { bookUrlSlug, pageUrlSlug, fullUrlSlug } = useUrlSlug()

  const timeoutRef = useRef<NodeJS.Timeout>()
  const [originSortableItems, setOriginSortableItems] = useState<SortableItem[]>([])

  useEffect(() => {
    if (sidebar.actionType !== type) return
    if (!sidebar.actionComplete) return
    sidebar.reset(originSortableItems)
    return () => {
      if (!timeoutRef.current) return
      clearTimeout(timeoutRef.current)
    }
  }, [sidebar.actionComplete])

  const onClick = () => {
    if (sidebar.actionActive) {
      sidebar.reset(originSortableItems)
      return
    }

    sidebar.setActionType(type)
    const timeout = setTimeout(() => sidebar.setActionActive(true), 100)
    timeoutRef.current = timeout

    // remove code
    let targetRoute = pageUrlSlug
    const isFolder = !!findFolder(sidebar.sortableItems, fullUrlSlug)

    // 폴더 타입이 아닐 경우 부모 폴더로 targetRoute를 변경
    if (!isFolder) {
      targetRoute = targetRoute.split('/').slice(0, -1).join('/') || '/'
    }

    setOriginSortableItems(sidebar.sortableItems)
    const coppeidPageMap = structuredClone(sidebar.sortableItems)

    function addNewFolderToItem(sortableItems: SortableItem[]) {
      for (const item of sortableItems) {
        const isMdxPage = item.kind === 'MdxPage'
        if (isMdxPage) continue

        const isFolderPage = item.kind === 'Folder'
        const isSeparator = item.type === 'separator'

        if (isSeparator) continue

        const isTarget = item.route.includes(targetRoute)
        const addToTop = targetRoute === '/'

        if (addToTop || isTarget) {
          const pageTypeMap = {
            page: 'newPage',
            folder: 'newFolder',
            separator: 'newSeparator',
          }

          const index = addToTop ? coppeidPageMap.length : item.children.length
          const newItem: SortableItem = {
            id: Math.random().toString(36).substring(7).slice(0, 9),
            title: 'addAction',
            type: pageTypeMap[type],
            depth: addToTop ? 1 : item.depth + 1,
            parentId: addToTop ? null : item.id,
            children: [],
            childrenIds: [],
            route: `${item.route}`,
            kind: 'Folder',
            name: 'addAction',
            isLast: true,
            collapsed: false,
            index,
            parent: addToTop ? null : item,
          }

          const removeBookUrlSlug = addToTop ? '' : item?.route.replace(bookUrlSlug, '')
          sidebar.setActionInfo({
            parentUrlSlug: removeBookUrlSlug ?? '',
            index,
            bookUrlSlug,
            type,
          })

          if (addToTop) {
            coppeidPageMap.push(newItem)
          } else {
            item.children.push(newItem)
          }

          sidebar.setSortableItems(coppeidPageMap)
          break
        }

        if (isFolderPage && item.children.length > 0) {
          addNewFolderToItem(item.children)
          continue
        }
      }
    }

    addNewFolderToItem(coppeidPageMap)
  }

  return (
    <span className={className} onClick={onClick}>
      {type === 'page' && <NewPageIcon />}
      {type === 'folder' && <NewFolderIcon />}
      {type === 'separator' && <SeparatorIcon />}
    </span>
  )
}

export default ControlIcon
