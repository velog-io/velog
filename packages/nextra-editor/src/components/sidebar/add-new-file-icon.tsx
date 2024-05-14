import { useRouter } from 'next/router'
import { useSidebar } from '../../contexts/sidebar'
import { NewFileIcon } from '../../nextra/icons/new-file'
import { useEffect, useRef, useState } from 'react'
import { PageMapItem } from '../../nextra/types'

type Props = {
  className?: string
}

const AddNewFileIcon = ({ className }: Props) => {
  const sidebar = useSidebar()
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const [originPageMap, setOriginPageMap] = useState<PageMapItem[]>([])

  useEffect(() => {
    if (!sidebar.addFileCancel) return
    sidebar.reset(originPageMap)
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [sidebar.addFileCancel])

  const onClickAddFileIcon = () => {
    if (sidebar.addFileActive) return

    const timeout = setTimeout(() => sidebar.setAddFileActive(true), 100)
    timeoutRef.current = timeout

    setOriginPageMap(sidebar.pageMap)

    const { query } = router
    const urlSlug = Array.isArray(query.page_url_slug) ? query.page_url_slug.join('/') : '/'
    const targetRoute = `/${urlSlug.split('-').slice(0, -1).join('-').trim()}`

    const coppeidPageMap = structuredClone(sidebar.pageMap)

    function addInputToPageMap(pageMap: PageMapItem[]) {
      for (const page of pageMap) {
        const mdxPage = page.kind === 'MdxPage'
        if (mdxPage) continue

        const metaPage = page.kind === 'Meta'
        const folderPage = page.kind === 'Folder'

        if (folderPage && page.children.length > 0) {
          addInputToPageMap(page.children)
          continue
        }

        if (!metaPage) continue

        const isTarget = page.route === targetRoute
        if (isTarget) {
          const key = Math.random().toString(36).substring(7).slice(0, 9)
          const newPageData = { ...page.data, [key]: { title: key, type: 'newFile' } }

          sidebar.setAddFileInfo({
            parentUrlSlug: page.route,
            index: Object.keys(newPageData).length - 1,
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

export default AddNewFileIcon
