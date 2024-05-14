import { PageMapItem } from '../nextra/types'
import { createContext, ReactElement, ReactNode, useContext, useState } from 'react'
import { Context } from '../types'

type Sidebar = {
  pageMap: PageMapItem[]
  setPageMap: (pageMap: PageMapItem[]) => void
  reset: (pageMap: PageMapItem[]) => void
  addFileActive: boolean
  setAddFileActive: (value: boolean) => void
  addFileCancel: boolean
  setAddFileCancel: (value: boolean) => void
}

const SidebarContext = createContext<Sidebar>({
  pageMap: [],
  setPageMap: () => {},
  reset: () => {},
  addFileActive: false,
  setAddFileActive: () => {},
  addFileCancel: false,
  setAddFileCancel: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export const SidebarProvider = ({
  children,
  value: { pageOpts },
}: {
  children: ReactNode
  value: Context
}): ReactElement => {
  const [pageMap, setPageMap] = useState(pageOpts.pageMap)
  const [addFileCancel, setAddFileCancel] = useState(false)
  const [addFileActive, setAddFileActive] = useState(false)

  const reset = (originPageMap: PageMapItem[]) => {
    setPageMap(originPageMap)
    setAddFileCancel(false)
    setAddFileActive(false)
  }

  const option: Sidebar = {
    pageMap,
    setPageMap,
    reset,
    addFileCancel,
    setAddFileCancel,
    addFileActive,
    setAddFileActive,
  }

  return <SidebarContext.Provider value={option}>{children}</SidebarContext.Provider>
}
