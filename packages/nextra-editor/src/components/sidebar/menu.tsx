import cn from 'clsx'
import { ReactElement } from 'react'
import { Item, PageItem } from '../../nextra/normalize-pages'
import { Heading } from '../../nextra/types'
import { classes } from './style'
import { Folder } from './folder'
import { File } from './file'
import { Separator } from './separator'
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { DraggableAttributes, Over } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { Transform } from '@dnd-kit/utilities'

interface MenuProps {
  directories: PageItem[] | Item[]
  anchors?: Heading[]
  base?: string
  className?: string
  onlyCurrentDocs?: boolean
  border?: boolean
}

export type MenuItemProps = {
  setDraggableNodeRef: (node: HTMLElement | null) => void
  setDroppableNodeRef: (node: HTMLElement | null) => void
  attributes: DraggableAttributes
  listeners: SyntheticListenerMap | undefined
  isDragTarget: boolean
  isSorting: boolean
  transform: Transform | null
  transition: string | undefined
  isOver: boolean
  over: Over | null
}

export function Menu({ directories, className, border }: MenuProps): ReactElement {
  return (
    <div className={cn('nx-relative')}>
      <ul className={cn(classes.list, className, 'nx-pl-3')}>
        {directories.map((item) => {
          const key = item.id || item.name || item.route
          return <MenuInner key={key} item={item} />
        })}
      </ul>
      {border && (
        <div
          className={cn(
            'nx-y-full nx-absolute nx-inset-y-1 nx-left-0 nx-ml-3 nx-w-px',
            'nx-bg-gray-200 dark:nx-bg-neutral-800',
          )}
        />
      )}
    </div>
  )
}

const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, isDragging }) =>
  isSorting || isDragging ? false : true

function MenuInner({ item }: { item: PageItem | Item }) {
  const disabled = item.name === 'index'
  const {
    attributes,
    listeners,
    isDragging: isDragTarget,
    isSorting,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
    isOver,
    over,
  } = useSortable({
    id: item.id || item.name || item.route,
    data: item,
    disabled,
    animateLayoutChanges,
  })

  if (!item.id) {
    console.log('No id found for item', item)
    return null
  }

  const props = {
    attributes,
    listeners,
    isDragTarget,
    isSorting,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
    isOver,
    over,
  }

  return item.kind === 'Folder' ? (
    <Folder key={item.id} item={item} {...props} />
  ) : item.type === 'separator' ? (
    <Separator key={item.id} item={item} {...props} />
  ) : (
    <File key={item.id} item={item} {...props} />
  )
}
