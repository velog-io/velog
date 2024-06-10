import { Folder, PageMapItem } from '@/nextra/types'

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
