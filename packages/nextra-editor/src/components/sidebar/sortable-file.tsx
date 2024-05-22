import { createContext, useContext, type ReactElement } from 'react'
import type { Item, PageItem } from '../../nextra/normalize-pages'
import { useFSRoute } from '../../nextra/hooks'
import { useDraggable } from '@dnd-kit/core'
import { ActionType } from '../../contexts/sidebar'
import { Separator } from './sidebar'
import { useActiveAnchor, useConfig, useMenu } from '../../contexts'
import AddInputs from './add-inputs'
import cn from 'clsx'
import { Anchor } from '../anchor'

const OnFocusItemContext = createContext<null | ((item: string | null) => any)>(null)

const classes = {
  link: cn(
    'nx-flex nx-rounded nx-px-2 nx-py-1.5 nx-text-sm nx-transition-colors [word-break:break-word]',
    'nx-cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:nx-border',
  ),
  inactive: cn(
    'nx-text-gray-500 hover:nx-bg-gray-100 hover:nx-text-gray-900',
    'dark:nx-text-neutral-400 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50',
    'contrast-more:nx-text-gray-900 contrast-more:dark:nx-text-gray-50',
    'contrast-more:nx-border-transparent contrast-more:hover:nx-border-gray-900 contrast-more:dark:hover:nx-border-gray-50',
  ),
  active: cn(
    'nx-bg-primary-100 nx-font-semibold nx-text-primary-800 dark:nx-bg-primary-400/10 dark:nx-text-primary-600',
    'contrast-more:nx-border-primary-500 contrast-more:dark:nx-border-primary-500',
  ),
  list: cn('nx-flex nx-flex-col nx-gap-1'),
  border: cn(
    'nx-relative before:nx-absolute before:nx-inset-y-1',
    'before:nx-w-px before:nx-bg-gray-200 before:nx-content-[""] dark:before:nx-bg-neutral-800',
    'ltr:nx-pl-3 ltr:before:nx-left-0 rtl:nx-pr-3 rtl:before:nx-right-0',
  ),
}

function SortableFile({ item }: { item: PageItem | Item }): ReactElement {
  const route = useFSRoute()
  const onFocus = useContext(OnFocusItemContext)

  // It is possible that the item doesn't have any route - for example an external link.
  const active = item.route && [route, route + '/'].includes(item.route + '/')
  const { setMenu } = useMenu()

  if (item.type === 'separator') {
    return <Separator title={item.title} />
  }

  if (['newPage', 'newFolder', 'newSeparator'].includes(item.type)) {
    const map: Record<string, ActionType> = {
      newPage: 'page',
      newFolder: 'folder',
      newSeparator: 'separator',
    }

    return <AddInputs type={map[item.type]} />
  }

  return (
    <li className={cn(classes.list, { active })}>
      <Anchor
        href={(item as PageItem).href || item.route}
        newWindow={(item as PageItem).newWindow}
        className={cn(classes.link, active ? classes.active : classes.inactive)}
        onClick={() => {
          setMenu(false)
        }}
        onFocus={() => {
          onFocus?.(item.route)
        }}
        onBlur={() => {
          onFocus?.(null)
        }}
      ></Anchor>
    </li>
  )
}

export default SortableFile
