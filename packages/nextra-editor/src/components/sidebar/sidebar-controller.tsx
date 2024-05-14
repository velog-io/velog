import cn from 'clsx'
import CollapseAllIcon from './collapse-all-icon'
import AddNewFileIcon from './add-new-file-icon'
import AddFolderIcon from './add-folder-icon'
import AddSeperatorIcon from './add-seperator-icon'

type Props = {
  showSidebar: boolean
}

function SidebarController({ showSidebar }: Props) {
  const style = cn(
    'nextra-sidebar-controller',
    'nx-cursor-pointer nx-p-1',
    'nx-transition-colors nx-text-gray-600 dark:nx-text-gray-400 hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50',
  )

  return (
    <div
      className={cn(
        'nx-flex nx-flex-row nx-justify-end nx-p-1',
        'nx-sticky nx-top-0 nx-pt-4 nx-z-10',
        'nx-bg-white dark:nx-bg-dark',
        showSidebar ? 'nx-block' : 'nx-hidden',
      )}
    >
      <AddNewFileIcon className={style} />
      <AddFolderIcon className={style} />
      <AddSeperatorIcon className={style} />
      <CollapseAllIcon className={style} />
    </div>
  )
}

export default SidebarController
