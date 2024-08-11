import { createContext, ReactElement, ReactNode, useContext, useState } from 'react'
import type { SortableItem } from '@/nextra/normalize-pages'

type ActionInfo<T = string> = T extends 'add'
  ? AddActionInfo
  : T extends 'edit'
    ? EditActionInfo
    : T extends 'delete'
      ? DeleteActionInfo
      : null

export type AddActionInfo = {
  action: 'add'
  parentUrlSlug?: string
  bookUrlSlug?: string
  type?: PageType
  index?: number
}

export type EditActionInfo = {
  action: 'edit'
  title?: string
  pageUrlSlug?: string
}

export type DeleteActionInfo = {
  action: 'delete'
  title: string
  childrenCount: number
}

export type PageType = 'folder' | 'page' | 'separator' | ''

type Sidebar = {
  originSortableItems: SortableItem[]
  setOriginSortableItems: (item: SortableItem[]) => void
  sortableItems: SortableItem[]
  setSortableItems: (item: SortableItem[]) => void
  reset: () => void
  isActionActive: boolean
  setIsActionActive: (value: boolean) => void
  actionInfo: ActionInfo
  setActionInfo: <T>(args: ActionInfo<T>) => void
  isFolding: boolean
  setIsFolding: (value: boolean) => void
  focusedItem: SortableItem | null
  setFocusedItem: (value: SortableItem | null) => void
  collapsedTree: Set<string>
  setCollapsedTree: (id: string, setter: (value: boolean) => boolean) => void
  showMenuId: string | null
  setShowMenuId: (value: string | null) => void
  isAddAction: (args: any) => boolean
  isEditAction: (args: any) => boolean
  isDeleteAction: (args: any) => boolean
}

let collapsedTree = new Set<string>()

function setCollapsedTree(id: string, setter: (value: boolean) => boolean): void {
  const visible = collapsedTree.has(id)
  const result = setter(visible)
  if (result) {
    collapsedTree.add(id)
  } else {
    collapsedTree.delete(id)
  }
}

const SidebarContext = createContext<Sidebar>({
  originSortableItems: [],
  setOriginSortableItems: () => {},
  sortableItems: [],
  setSortableItems: () => {},
  reset: () => {},
  isActionActive: false,
  setIsActionActive: () => {},
  actionInfo: null,
  setActionInfo: () => {},
  isFolding: false,
  setIsFolding: () => {},
  focusedItem: null,
  setFocusedItem: () => {},
  collapsedTree,
  setCollapsedTree,
  showMenuId: null,
  setShowMenuId: () => {},
  isAddAction: () => false,
  isEditAction: () => false,
  isDeleteAction: () => false,
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export const SidebarProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [originSortableItems, setOriginSortableItems] = useState<SortableItem[]>([])
  const [sortableItems, setSortableItems] = useState<SortableItem[]>([])
  const [isFolding, setFolding] = useState(false)
  const [isActionActive, setIsActionActive] = useState(false)
  const [showMenuId, setShowMenuId] = useState<string | null>(null)

  const [focusedItem, setFocusedItem] = useState<null | SortableItem>(null)
  const [actionInfo, setActionInfo] = useState<ActionInfo>(null)

  const reset = () => {
    setOriginSortableItems([])
    setIsActionActive(false)
    setFocusedItem(null)
    setActionInfo(null)
  }

  const setIsFolding = (value: boolean) => {
    if (value) {
      collapsedTree = new Set<string>()
    }
    setFolding(value)
  }

  function setActionInformation<T = 'add' | 'edit' | 'delete'>(args: ActionInfo<T>): void {
    if (!isActionActive) {
      setIsActionActive(true)
    }
    setActionInfo(args as any)
  }

  function isAddAction(args: any): args is AddActionInfo {
    return args.action === 'add'
  }

  function isEditAction(args: any): args is EditActionInfo {
    return args.action === 'edit'
  }

  function isDeleteAction(args: any): args is DeleteActionInfo {
    return args.action === 'delete'
  }

  const value: Sidebar = {
    originSortableItems,
    setOriginSortableItems,
    sortableItems,
    setSortableItems,
    reset,
    isActionActive,
    setIsActionActive,
    actionInfo,
    setActionInfo: setActionInformation,
    isFolding,
    setIsFolding,
    focusedItem,
    setFocusedItem,
    collapsedTree,
    setCollapsedTree,
    showMenuId,
    setShowMenuId,
    isAddAction,
    isEditAction,
    isDeleteAction,
  }

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}
