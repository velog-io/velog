import cn from 'clsx'
import { ControlIcons } from './control-icons'
import { CollapseAllIcon } from './collapse-all-icon'
import { PageType, useSidebar } from '@/contexts/sidebar'
import { useUrlSlug } from '@/hooks'
import { useRef } from 'react'
import { SortableItem } from '@/nextra/normalize-pages'
import { findFolder } from '../utils'

type Props = {
  showSidebar: boolean
}

const style = cn(
  'nextra-sidebar-control-icon',
  'nx-cursor-pointer nx-p-1',
  'nx-transition-colors nx-text-gray-600 dark:nx-text-gray-400 hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50',
)

export function SidebarHeader({ showSidebar }: Props) {
  const {
    isActionActive,
    originSortableItems,
    setOriginSortableItems,
    setSortableItems,
    sortableItems,
    reset,
    setIsActionActive,
    setActionInfo,
  } = useSidebar()
  const { bookUrlSlug, pageUrlSlug, fullUrlSlug } = useUrlSlug()

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const onClickIcon = (type: PageType) => {
    if (type === '') return
    if (isActionActive) {
      console.log('isCancel')
      if (originSortableItems.length > 0) {
        setSortableItems(originSortableItems)
      }
      reset()
      return
    }

    // init
    timeoutRef.current = setTimeout(() => setIsActionActive(true), 200)
    setOriginSortableItems(sortableItems) // 취소 되었을때 원래 데이터로 복구하기 위함

    // remove code
    let targetRoute = pageUrlSlug
    const isFolder = !!findFolder(sortableItems, fullUrlSlug)

    // 폴더 타입이 아닐 경우 부모 폴더로 targetRoute를 변경
    if (!isFolder) {
      targetRoute = targetRoute.split('/').slice(0, -1).join('/') || '/'
    }

    const coppeidPageMap = structuredClone(sortableItems)

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
            isLast: false,
            collapsed: false,
            code: 'code',
            urlSlug: '',
            index,
            parent: addToTop ? null : item,
          }

          const removeBookUrlSlug = addToTop ? '' : item?.route.replace(bookUrlSlug, '')
          setActionInfo<'add'>({
            action: 'add',
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

          setSortableItems(coppeidPageMap)
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
      <ControlIcons className={style} onClick={onClickIcon} type="page" />
      <ControlIcons className={style} onClick={onClickIcon} type="folder" />
      <ControlIcons className={style} onClick={onClickIcon} type="separator" />
      <CollapseAllIcon className={style} />
    </div>
  )
}
