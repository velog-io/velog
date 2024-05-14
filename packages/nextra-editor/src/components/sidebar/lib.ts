import type { PageMapItem } from '../../nextra/types'

export const findDepth = (pageMap: PageMapItem[], targetRoute: string): PageMapItem[] => {
  if (targetRoute === '/') return pageMap

  for (const page of pageMap) {
    const mdxPage = page.kind === 'MdxPage'
    if (mdxPage) continue

    const metaPage = page.kind === 'Meta'
    const folderPage = page.kind === 'Folder'

    if (folderPage && page.children.length > 0) {
      const result = findDepth(page.children, targetRoute)
      if (result) return result
      continue
    }

    if (!metaPage) continue

    const isTarget = page.route === targetRoute
    if (isTarget) {
      return pageMap
    }
  }

  return pageMap
}
