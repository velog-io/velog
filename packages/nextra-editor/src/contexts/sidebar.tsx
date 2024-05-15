import { PageMapItem } from '../nextra/types'
import { createContext, ReactElement, ReactNode, useContext, useState } from 'react'
import { Context } from '../types'

type Sidebar = {
  pageMap: PageMapItem[]
  setPageMap: (pageMap: PageMapItem[]) => void
  addFileReset: (pageMap: PageMapItem[]) => void
  addFileActive: boolean
  setAddFileActive: (value: boolean) => void
  addFileComplete: boolean
  setAddFileComplete: (value: boolean) => void
  addFileInfo: { parentUrlSlug: string; index: number }
  setAddFileInfo: (args: { parentUrlSlug: string; index: number }) => void
}

const SidebarContext = createContext<Sidebar>({
  pageMap: [],
  setPageMap: () => {},
  addFileReset: () => {},
  addFileActive: false,
  setAddFileActive: () => {},
  addFileComplete: false,
  setAddFileComplete: () => {},
  addFileInfo: { parentUrlSlug: '/', index: 0 },
  setAddFileInfo: () => {},
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
  const [addFileComplete, setAddFileComplete] = useState(false)
  const [addFileActive, setAddFileActive] = useState(false)
  const [addFileInfo, setAddFileInfo] = useState({ parentUrlSlug: '/', index: 0 })

  const addFileReset = (originPageMap: PageMapItem[]) => {
    setPageMap(originPageMap)
    setAddFileComplete(false)
    setAddFileActive(false)
  }

  const option: Sidebar = {
    pageMap,
    setPageMap,
    addFileReset,
    addFileComplete,
    setAddFileComplete,
    addFileActive,
    setAddFileActive,
    addFileInfo,
    setAddFileInfo,
  }

  return <SidebarContext.Provider value={option}>{children}</SidebarContext.Provider>
}
