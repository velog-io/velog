import { Item, PageItem, SortableItem } from '@/nextra/normalize-pages'
import { Active, Over, UniqueIdentifier } from '@dnd-kit/core'
import { Transform } from '@dnd-kit/utilities'
import { CSSProperties } from 'react'

export type SortableTreeItemProps = {
  setNodeRef: (node: HTMLElement | null) => void
  setActivatorNodeRef: (node: HTMLElement | null) => void
  ref: (node: HTMLElement | null) => void
  wrapperRef: (node: HTMLElement | null) => void
  isGhost: boolean
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
  depth: number
  indentationWidth: number
  onCollapse: (id: UniqueIdentifier) => void
  handleProps: any
  clone: boolean
}

export type SortableTreeComponentProps = {
  item: SortableItem
} & SortableTreeItemProps
