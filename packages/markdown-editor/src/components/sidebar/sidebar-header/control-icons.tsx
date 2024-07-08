import { PageType } from '@/contexts/sidebar'
import { NewFolderIcon } from '@/nextra/icons/new-folder'
import { NewPageIcon } from '@/nextra/icons/new-page'
import { SeparatorIcon } from '@/nextra/icons/separator'
import { MouseEvent } from 'react'

type Props = {
  className: string
  type: PageType
  onClick: (type: PageType) => void
}

export const ControlIcons = ({ className, type, onClick }: Props) => {
  if (type === '') return
  const handleClick = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation()
    onClick(type)
  }
  return (
    <span className={className} onClick={(e) => handleClick(e)}>
      {type === 'page' && <NewPageIcon />}
      {type === 'folder' && <NewFolderIcon />}
      {type === 'separator' && <SeparatorIcon />}
    </span>
  )
}
