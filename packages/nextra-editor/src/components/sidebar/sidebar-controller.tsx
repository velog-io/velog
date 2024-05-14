import cn from 'clsx'
import { useConfig } from '../../contexts'
import { SeparatorIcon } from '../../nextra/icons/seperator'
import { NewFileIcon } from '../../nextra/icons/new-file'
import { NewFolderIcon } from '../../nextra/icons/new-folder'
import { CollapseAllIcon } from '../../nextra/icons/collapse-all'
import { useRouter } from 'next/router'
import { findDepth } from './lib'

type Props = {
  showSidebar: boolean
}

function SidebarController({ showSidebar }: Props) {
  const config = useConfig()
  const router = useRouter()

  const onAddFileInput = () => {
    const { query } = router
    const urlSlug = Array.isArray(query.page_url_slug) ? query.page_url_slug.join('/') : '/'
    const targetRoute = `/${urlSlug.split('-').slice(0, -1).join('-').trim()}`

    const coppeidPageMap = structuredClone(config.pageMap)
    const targetPageMap = findDepth(coppeidPageMap, targetRoute)

    const ran = Math.random().toString(36).substring(7)

    for (const page of targetPageMap) {
      if (page.kind !== 'Meta') continue
      const key = `${ran}`
      const newPageData = { ...page.data, [key]: { title: key, type: 'newFile' } }
      page.data = newPageData
    }
    config.setPageMap(coppeidPageMap)
  }

  return (
    <div
      className={cn(
        'nx-flex nx-flex-row nx-justify-end nx-p-1',
        showSidebar ? 'nx-block' : 'nx-hidden',
      )}
    >
      <span
        className={cn(
          'nx-cursor-pointer nx-p-1',
          'nx-transition-colors nx-text-gray-600 dark:nx-text-gray-400 hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50 nx-rounded-md',
        )}
      >
        <NewFileIcon onClick={onAddFileInput} />
      </span>
      <span
        className={cn(
          'nx-pl-2 nx-cursor-pointer nx-p-1',
          'nx-transition-colors nx-text-gray-600 dark:nx-text-gray-400 hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50',
        )}
      >
        <NewFolderIcon />
      </span>
      <span
        className={cn(
          'nx-pl-2 nx-cursor-pointer nx-p-1',
          'nx-transition-colors nx-text-gray-600 dark:nx-text-gray-400 hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50',
        )}
      >
        <SeparatorIcon />
      </span>
      <span
        className={cn(
          'nx-cursor-pointer nx-p-1',
          'nx-transition-colors nx-text-gray-600 dark:nx-text-gray-400 hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50',
        )}
      >
        <CollapseAllIcon />
      </span>
    </div>
  )
}

export default SidebarController
