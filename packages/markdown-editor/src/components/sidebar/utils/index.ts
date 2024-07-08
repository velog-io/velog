import { arrayMove } from '@dnd-kit/sortable'
import { Active, UniqueIdentifier } from '@dnd-kit/core'
import { FlattenedItem, TreeItem, TreeItems } from '@/types'
import { Item, PageItem, SortableItem } from '@/nextra/normalize-pages'
import { customCollisionDetectionAlgorithm } from './customCollisionDetection'
import { customListSortingStrategy } from './customListSortingStrategy'
import { dropAnimation } from './dropAnimation'
import { keyboardCoordinates } from './keyborardCoordinates'
import { normalizePageToTreeData } from './normalizePageToTreeData'
import { findFolder } from './findFolder'

export const MAX_DEPTH = 3

function flatten<T extends SortableItem>(
  items: TreeItems<T>,
  parentId: UniqueIdentifier | null = null,
  depth = 0,
  parent: FlattenedItem<T> | null = null,
): FlattenedItem<T>[] {
  return items.reduce<FlattenedItem<T>[]>((acc, item, index) => {
    const flattenedItem: FlattenedItem<T> = {
      ...item,
      parentId,
      depth,
      index,
      isLast: items.length === index + 1,
      parent: parent,
    }
    return [
      ...acc,
      flattenedItem,
      ...flatten(item.children ?? [], item.id, depth + 1, flattenedItem),
    ]
  }, [])
}

function flattenTree<T extends SortableItem>(items: TreeItems<T>): FlattenedItem<T>[] {
  return flatten(items)
}

function findItem<T>(items: TreeItem<T>[], itemId: UniqueIdentifier) {
  return items.find(({ id }) => id === itemId)
}

function buildTree<T extends Record<string, any>>(
  flattenedItems: FlattenedItem<T>[],
): TreeItems<T> {
  const root: TreeItem<T> = { id: 'root', children: [] } as any
  const nodes: Record<string, TreeItem<T>> = { [root.id]: root }
  const items = flattenedItems.map((item) => ({ ...item, children: [] }))

  for (const item of items) {
    const { id } = item
    const parentId = item.parentId ?? root.id
    const parent = nodes[parentId] ?? findItem(items, parentId)
    item.parent = null
    nodes[id] = item

    if (parent) {
      parent?.children?.push(item)
      parent.childrenIds = parent ? parent.children?.map((child) => child.id) : []
    }
  }

  return root.children ?? []
}

function findItemDeep(
  items: SortableItem[],
  itemId: UniqueIdentifier | null,
): SortableItem | undefined {
  if (!itemId) return undefined

  for (const item of items) {
    const { id, children } = item

    if (id === itemId) {
      return item
    }

    if (children?.length) {
      const child = findItemDeep(children, itemId)

      if (child) {
        return child
      }
    }
  }

  return undefined
}

function setProperty<T extends keyof SortableItem>(
  items: SortableItem[],
  id: UniqueIdentifier,
  property: T,
  setter: (value: SortableItem[T]) => SortableItem[T],
): SortableItem[] {
  for (const item of items) {
    if (item.id === id) {
      item[property] = setter(item[property])
      continue
    }

    if (item.children?.length) {
      item.children = setProperty(item.children, id, property, setter)
    }
  }
  return [...items]
}

function setPropertyAll<T extends keyof SortableItem>(
  items: SortableItem[],
  property: T,
  setter: (value: SortableItem[T]) => SortableItem[T],
): SortableItem[] {
  for (const item of items) {
    item[property] = setter(item[property])

    if (item.children?.length) {
      item.children = setPropertyAll(item.children, property, setter)
    }
  }
  return [...items]
}

function removeItem<T extends Record<string, any>>(items: TreeItems<T>, id: string) {
  const newItems = []

  for (const item of items) {
    if (item.id === id) {
      continue
    }

    if (item.children?.length) {
      item.children = removeItem(item.children, id)
    }
    newItems.push(item)
  }

  return newItems
}

function findAllParents(
  item: FlattenedItem,
  items: FlattenedItem[],
  parents: FlattenedItem[] = [],
): FlattenedItem[] {
  if (item.depth === 0) return parents
  const parent = items.find(({ id }) => id === item.parentId)
  if (parent?.depth === 0) return [...parents, parent]
  if (parent) return findAllParents(parent, items, [...parents, parent])
  return parents
}

function removeChildrenOf(items: FlattenedItem[], ids: UniqueIdentifier[]): FlattenedItem[] {
  const collapsedIds = [...ids]
  return items.filter((item) => {
    if (item.depth === 0) return true
    if (item.parentId && collapsedIds.includes(item.parentId)) {
      const parents = findAllParents(item, items)
      const isAllOpen = parents.every((parent) => parent.collapsed)
      if (!isAllOpen) return false
      return true
    }
    return false
  })
}

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth)
}

function getProjection(
  items: SortableItem[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number,
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId)
  const activeItemIndex = items.findIndex(({ id }) => id === activeId)
  const activeItem = items[activeItemIndex]
  const newItems = arrayMove(items, activeItemIndex, overItemIndex)
  const previousItem = newItems[overItemIndex - 1]

  const nextItem = newItems[overItemIndex + 1]
  const dragDepth = getDragDepth(dragOffset, indentationWidth)

  const projectedDepth = activeItem.depth + dragDepth
  const maxDepth = getMaxDepth({
    previousItem,
  })
  const minDepth = getMinDepth({ nextItem })
  let depth = projectedDepth

  if (projectedDepth >= maxDepth) {
    depth = maxDepth
  } else if (projectedDepth < minDepth) {
    depth = minDepth
  }

  if (previousItem && (previousItem.kind === 'MdxPage' || previousItem.type === 'separator')) {
    depth = previousItem.depth
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() }

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId
    }

    if (depth > previousItem.depth) {
      return previousItem.id
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId

    return newParent ?? null
  }
}

function getMaxDepth({ previousItem }: { previousItem: SortableItem }) {
  if (previousItem) {
    return previousItem.depth + 1
  }

  return 0
}

function getMinDepth({ nextItem }: { nextItem: SortableItem }) {
  if (nextItem) {
    return nextItem.depth
  }

  return 0
}

const findParent = (items: PageItem[] | Item[], active: Active | null): PageItem | Item | null => {
  if (!active) return null
  for (const item of items) {
    if (item.id === active.id) {
      return item
    }

    if (Array.isArray(item.children)) {
      const parent = findParent(item.children, active)
      if (parent) return parent
    }
  }
  return null
}

const getIsParentOver = (
  parent: PageItem | Item | null,
  overId: UniqueIdentifier | undefined,
): boolean => {
  if (!parent || !overId) return false
  if (parent.id === overId) return true
  return false
}

export {
  normalizePageToTreeData,
  flattenTree,
  findItemDeep,
  findItem,
  removeItem,
  setProperty,
  setPropertyAll,
  removeChildrenOf,
  getProjection,
  buildTree,
  findParent,
  getIsParentOver,
  customCollisionDetectionAlgorithm,
  customListSortingStrategy,
  dropAnimation,
  keyboardCoordinates,
  findFolder,
}
