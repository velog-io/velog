import { Item, PageItem } from '@/nextra/normalize-pages'
import { Active, DraggableAttributes, Over, UniqueIdentifier } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { Transform } from '@dnd-kit/utilities'
import { CSSProperties } from 'react'

export type SortableTreeItemProps = {
  setNodeRef: (node: HTMLElement | null) => void
  setActivatorNodeRef: (node: HTMLElement | null) => void
  setDraggableNodeRef: (node: HTMLElement | null) => void
  setDroppableNodeRef: (node: HTMLElement | null) => void
  attributes: DraggableAttributes
  listeners: SyntheticListenerMap | undefined
  isDragTarget: boolean
  isSorting: boolean
  transform: Transform | null
  transition: string | undefined
  isOver: boolean
  isParentOver: boolean
  over: Over | null
  active: Active | null
  style: CSSProperties
  parent: PageItem | Item | null
  isChildrenOver: boolean
  level: number
  indentationWidth: number
  onCollapse: (id: UniqueIdentifier) => void
}
