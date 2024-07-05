import cn from 'clsx'
import { ControlIcon } from './control-icon'
import { CollapseAllIcon } from './collapse-all-icon'
import { ActionType, useSidebar } from '@/contexts/sidebar'
import { useUrlSlug } from '@/hooks/use-url-slug'
import { useRef, useState } from 'react'
import { SortableItem } from '@/nextra/normalize-pages'
import { findFolder } from './utils'

type Props = {
  showSidebar: boolean
}

const style = cn(
  'nextra-sidebar-control-icon',
  'nx-cursor-pointer nx-p-1',
  'nx-transition-colors nx-text-gray-600 dark:nx-text-gray-400 hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50',
)

export function SidebarController({ showSidebar }: Props) {
  const sidebar = useSidebar()
  const { bookUrlSlug, pageUrlSlug, fullUrlSlug } = useUrlSlug()

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [originSortableItems, setOriginSortableItems] = useState<SortableItem[]>([])

  const onClickIcon = (type: ActionType) => {
    if (type === '') return
    if (sidebar.actionActive) {
      sidebar.reset()
      sidebar.setSortableItems(originSortableItems)
      return
    }

    sidebar.setActionType(type)
    const timeout = setTimeout(() => sidebar.setActionActive(true), 100)
    timeoutRef.current = timeout
    setOriginSortableItems(sidebar.sortableItems)

    // remove code
    let targetRoute = pageUrlSlug
    const isFolder = !!findFolder(sidebar.sortableItems, fullUrlSlug)

    // 폴더 타입이 아닐 경우 부모 폴더로 targetRoute를 변경
    if (!isFolder) {
      targetRoute = targetRoute.split('/').slice(0, -1).join('/') || '/'
    }

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
          const pageTypeMap: Record<string, string> = {
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
            code: 'code',
            urlSlug: '',
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
    <div
      className={cn(
        'nx-flex nx-flex-row nx-justify-end nx-p-1',
        'nx-sticky nx-top-0 nx-z-10 nx-pt-4',
        'nx-bg-white dark:nx-bg-dark',
        showSidebar ? 'nx-block' : 'nx-hidden',
      )}
    >
      <ControlIcon className={style} onClick={onClickIcon} type="page" />
      <ControlIcon className={style} onClick={onClickIcon} type="folder" />
      <ControlIcon className={style} onClick={onClickIcon} type="separator" />
      <CollapseAllIcon className={style} />
    </div>
  )
}
