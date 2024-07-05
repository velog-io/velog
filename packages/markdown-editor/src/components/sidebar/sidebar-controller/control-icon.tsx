import { ActionType } from '@/contexts/sidebar'
import { NewFolderIcon } from '@/nextra/icons/new-folder'
import { NewPageIcon } from '@/nextra/icons/new-page'
import { SeparatorIcon } from '@/nextra/icons/separator'

type Props = {
  className: string
  type: ActionType
  onClick: (type: ActionType) => void
}

export const ControlIcon = ({ className, type, onClick }: Props) => {
  if (type === '') return
  return (
    <span className={className} onClick={() => onClick(type)}>
      {type === 'page' && <NewPageIcon />}
      {type === 'folder' && <NewFolderIcon />}
      {type === 'separator' && <SeparatorIcon />}
    </span>
  )
}
