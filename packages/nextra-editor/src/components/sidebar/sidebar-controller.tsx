import cn from 'clsx'
import { useConfig } from '../../contexts'
import { SeparatorIcon } from '../../nextra/icons/seperator'
import { NewFileIcon } from '../../nextra/icons/new-file'
import { NewFolderIcon } from '../../nextra/icons/new-folder'
import { CollapseAllIcon } from '../../nextra/icons/collapse-all'

type Props = {
  showSidebar: boolean
}

export function SidebarController({ showSidebar }: Props) {
  const config = useConfig()

  const handleAddFile = () => {
    const newPageMap = config.pageMap.map((page) => {
      if (page.kind !== 'Meta') return page
      const newPageData = { ...page.data, 'new-file': { title: 'newfile', type: 'newFile' } }
      return {
        ...page,
        data: newPageData,
      }
    })

    newPageMap.push({
      kind: 'MdxPage',
      name: 'new-file',
      route: '/',
    })

    config.setPageMap(newPageMap)
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
        <NewFileIcon onClick={handleAddFile} />
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
