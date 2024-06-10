import { arrayMove } from '@dnd-kit/sortable'
import { Active, UniqueIdentifier } from '@dnd-kit/core'
import { Folder, PageMapItem } from '@/nextra/types'
import { FlattenedItem, TreeItem, TreeItems } from '@/types'
import { Item, PageItem, SortableItem } from '@/nextra/normalize-pages'

export function findFolder(pageMap: PageMapItem[], route: string): Folder | undefined {
  const folders = pageMap.filter((page) => page.kind === 'Folder')
  for (const folder of folders) {
    if (folder.route === route) {
      return folder
    }

    if (folder.children.length === 0) continue

    const found = findFolder(folder.children, route)
    if (found) return found
  }
  return undefined
}

export function initilizeDirectories(
  items: PageItem[] | Item[],
  parentId: UniqueIdentifier | null = null,
  level = 0,
  parent: PageItem | Item | null = null,
): SortableItem[] {
  return items.map((item, index) => {
    const data: Omit<SortableItem, 'childrenIds'> = {
      ...item,
      parentId,
      level,
      isLast: items.length === index + 1,
      parent,
      children: item.children ? initilizeDirectories(item.children, item.id, level + 1, item) : [],
      collapsed: false,
    }
    return {
      ...data,
      childrenIds: data.children.map((child: SortableItem) => child.id),
    } as SortableItem
  })
}

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

export function flattenTree<T extends SortableItem>(items: TreeItems<T>): FlattenedItem<T>[] {
  return flatten(items)
}

export function findItem<T>(items: TreeItem<T>[], itemId: UniqueIdentifier) {
  return items.find(({ id }) => id === itemId)
}

export function buildTree<T extends Record<string, any>>(
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
    parent?.children?.push(item)
  }

  return root.children ?? []
}

export function findItemDeep<T extends Record<string, any>>(
  items: TreeItems<T>,
  itemId: UniqueIdentifier,
): TreeItem<T> | undefined {
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

export function setProperty<T extends keyof SortableItem>(
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

export function removeItem<T extends Record<string, any>>(items: TreeItems<T>, id: string) {
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

export function removeChildrenOf<T>(items: FlattenedItem<T>[], ids: UniqueIdentifier[]) {
  const excludeParentIds = [...ids]

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.children?.length) {
        excludeParentIds.push(item.id)
      }
      return false
    }

    return true
  })
}

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth)
}

let _revertLastChanges = () => {}
export function getProjection<T>(
  items: FlattenedItem<T>[],
  activeId: UniqueIdentifier | null,
  overId: UniqueIdentifier | null,
  dragOffset: number,
  indentationWidth: number,
  keepGhostInPlace: boolean,
  canRootHaveChildren?: boolean | ((dragItem: FlattenedItem<T>) => boolean),
): {
  depth: number
  parentId: UniqueIdentifier | null
  parent: FlattenedItem<T> | null
  isLast: boolean
} | null {
  _revertLastChanges()
  _revertLastChanges = () => {}
  if (!activeId || !overId) return null

  const overItemIndex = items.findIndex(({ id }) => id === overId)
  const activeItemIndex = items.findIndex(({ id }) => id === activeId)
  const activeItem = items[activeItemIndex]
  if (keepGhostInPlace) {
    let parent: FlattenedItem<T> | null | undefined = items[overItemIndex]
    parent = findParentWhichCanHaveChildren(parent, activeItem, canRootHaveChildren)
    if (parent === undefined) return null
    return {
      depth: parent?.depth ?? 0 + 1,
      parentId: parent?.id ?? null,
      parent: parent,
      isLast: !!parent?.isLast,
    }
  }
  const newItems = arrayMove(items, activeItemIndex, overItemIndex)
  const previousItem = newItems[overItemIndex - 1]
  const nextItem = newItems[overItemIndex + 1]
  const dragDepth = getDragDepth(dragOffset, indentationWidth)
  const projectedDepth = activeItem.depth + dragDepth

  let depth = projectedDepth
  const directParent = findParentWithDepth(depth - 1, previousItem)
  const parent = findParentWhichCanHaveChildren(directParent, activeItem, canRootHaveChildren)
  if (parent === undefined) return null
  const maxDepth = (parent?.depth ?? -1) + 1
  const minDepth = nextItem?.depth ?? 0
  if (minDepth > maxDepth) return null
  if (depth >= maxDepth) {
    depth = maxDepth
  } else if (depth < minDepth) {
    depth = minDepth
  }
  const isLast = (nextItem?.depth ?? -1) < depth

  if (parent && parent.isLast) {
    _revertLastChanges = () => {
      parent!.isLast = true
    }
    parent.isLast = false
  }
  return {
    depth,
    parentId: getParentId(),
    parent,
    isLast,
  }

  function findParentWithDepth(depth: number, previousItem: FlattenedItem<T>) {
    if (!previousItem) return null
    while (depth < previousItem.depth) {
      if (previousItem.parent === null) return null
      previousItem = previousItem.parent
    }
    return previousItem
  }
  function findParentWhichCanHaveChildren(
    parent: FlattenedItem<T> | null,
    dragItem: FlattenedItem<T>,
    canRootHaveChildren?: boolean | ((dragItem: FlattenedItem<T>) => boolean),
  ): FlattenedItem<T> | null | undefined {
    if (!parent) {
      const rootCanHaveChildren =
        typeof canRootHaveChildren === 'function'
          ? canRootHaveChildren(dragItem)
          : canRootHaveChildren
      if (rootCanHaveChildren === false) return undefined
      return parent
    }
    const canHaveChildren =
      typeof parent.canHaveChildren === 'function'
        ? parent.canHaveChildren(dragItem)
        : parent.canHaveChildren
    if (canHaveChildren === false)
      return findParentWhichCanHaveChildren(parent.parent, activeItem, canRootHaveChildren)
    return parent
  }

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

export const findParent = (
  items: PageItem[] | Item[],
  active: Active | null,
): PageItem | Item | null => {
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

export const getIsParentOver = (
  parent: PageItem | Item | null,
  overId: UniqueIdentifier | undefined,
): boolean => {
  if (!parent || !overId) return false
  if (parent.id === overId) return true
  return false
}
