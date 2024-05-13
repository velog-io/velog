import type { PageMapItem } from '../../nextra/types'

function findDepth(
  type: 'file' | 'folder',
  pageMap: PageMapItem[],
  targetRoute: string,
): PageMapItem[] {
  const isFined = false
  const result = null
  for (const page of pageMap) {
    if (isFined) break
    const findMetaData = page.kind === 'Meta'

    if (!findMetaData) continue

    const isTarget = page.route === targetRoute

    if (isTarget) {
    }
    // const isFocused = page.
  }
}
