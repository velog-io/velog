import { SimpleTreeItemWrapper, type TreeItemComponentProps } from 'dnd-kit-sortable-tree'
import type { Item, PageItem } from '../../nextra/normalize-pages'
import type { ForwardedRef, ReactElement } from 'react'

type SortableMenuProps = {
  props: TreeItemComponentProps<PageItem | Item>
  ref: ForwardedRef<HTMLDivElement>
}

const SortableMenu = ({ props, ref }: SortableMenuProps): ReactElement => {
  const { item } = props
  const isFolder = item.kind === 'Folder'
  return (
    <SimpleTreeItemWrapper ref={ref} {...props}>
      {isFolder && <Folder key={item.name} item={item} anchors={[]} />}
      {!isFolder && <File key={item.name} item={item} anchors={[]} />}
    </SimpleTreeItemWrapper>
  )
}

export default SortableMenu
