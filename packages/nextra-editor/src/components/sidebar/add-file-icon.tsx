import { useSidebar } from '../../contexts/sidebar'
import { NewFileIcon } from '../../nextra/icons/new-file'
import { useEffect, useRef, useState } from 'react'
import { Folder, PageMapItem } from '../../nextra/types'
import { findFolder } from './utils'
import { useUrlSlug } from '../../hooks/useUrlSlug'

type Props = {
  className?: string
}

const AddFileIcon = ({ className }: Props) => {
  const sidebar = useSidebar()
  const { bookUrlSlug, pageUrlSlug, fullUrlSlug } = useUrlSlug()

  const timeoutRef = useRef<NodeJS.Timeout>()
  const [originPageMap, setOriginPageMap] = useState<PageMapItem[]>([])

  useEffect(() => {
    if (!sidebar.addFileComplete) return
    sidebar.addFileReset(originPageMap)
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [sidebar.addFileComplete])

  const onClickAddFileIcon = () => {
    if (sidebar.addFileActive) return

    const timeout = setTimeout(() => sidebar.setAddFileActive(true), 100)
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

    function addInputToPageMap(pageMap: PageMapItem[], parent?: Folder) {
      for (const page of pageMap) {
        const mdxPage = page.kind === 'MdxPage'
        if (mdxPage) continue

        const metaPage = page.kind === 'Meta'
        const folderPage = page.kind === 'Folder'

        if (folderPage && page.children.length > 0) {
          addInputToPageMap(page.children, page)
          continue
        }

        if (!metaPage) continue

        const isTarget = page.route === targetRoute
        if (isTarget) {
          const key = Math.random().toString(36).substring(7).slice(0, 9)
          const newPageData = { ...page.data, [key]: { title: key, type: 'newFile' } }

          const removeBookUrlSlug = parent?.route.replace(bookUrlSlug, '')
          sidebar.setAddFileInfo({
            parentUrlSlug: removeBookUrlSlug ?? '',
            index: Object.keys(newPageData).length - 1,
            bookUrlSlug,
          })

          page.data = newPageData
          sidebar.setPageMap(coppeidPageMap)
          break
        }
      }
    }

    addInputToPageMap(coppeidPageMap)
  }

  return (
    <span className={className} onClick={onClickAddFileIcon}>
      <NewFileIcon />
    </span>
  )
}

export default AddFileIcon
