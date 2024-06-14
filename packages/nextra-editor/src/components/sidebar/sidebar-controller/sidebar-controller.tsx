import cn from 'clsx'
import CollapseAllIcon from './collapse-all-icon'
import AddIcons from './add-icons'

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
        'nx-sticky nx-top-0 nx-z-10 nx-pt-4',
        'nx-bg-white dark:nx-bg-dark',
        showSidebar ? 'nx-block' : 'nx-hidden',
      )}
    >
      <AddIcons className={style} type="page" />
      <AddIcons className={style} type="folder" />
      <AddIcons className={style} type="separator" />
      <CollapseAllIcon className={style} />
    </div>
  )
}

export default SidebarController