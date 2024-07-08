import type { Item, PageItem, SortableItem } from '@/nextra/normalize-pages'
import type { UniqueIdentifier } from '@dnd-kit/core'
import { removeCodeFromRoute } from '@/utils'

export function normalizePageToTreeData(
  items: PageItem[] | Item[],
  route: string,
  collapsedTree: Set<string>,
  parentId: UniqueIdentifier | null = null,
  depth = 0,
  parent: PageItem | Item | null = null,
): SortableItem[] {
  return items.map((item, index) => {
    const open = route.startsWith(removeCodeFromRoute(item.route))
    const opened = collapsedTree.has(item.id)
    const collapsed = item.kind === 'Folder' && (open || opened)
    const data: Omit<SortableItem, 'childrenIds'> = {
      ...item,
      parentId,
      depth,
      isLast: items.length === index + 1,
      parent,
      children: item.children
        ? normalizePageToTreeData(item.children, route, collapsedTree, item.id, depth + 1, item)
        : [],
      collapsed: collapsed && item.kind === 'Folder',
      index,
    }
    return {
      ...data,
      childrenIds: data.children.map((child: SortableItem) => child.id),
    } as SortableItem
  })
}
