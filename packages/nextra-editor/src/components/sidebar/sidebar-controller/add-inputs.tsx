import { ReactElement, useState } from 'react'
import cn from 'clsx'

import { ActionType, useSidebar } from '@/contexts/sidebar'
import useOutsideClick from '@/hooks/use-outside-click'
import { EmptyFolderIcon } from '@/nextra/icons/empty-folder'
import { EmptyFileIcon } from '@/nextra/icons/empty-file'
import { SeparatorIcon } from '@/nextra/icons/separator'
import { type CustomEventDetail, nextraCustomEventName } from '@/index'

type Props = {
  type: ActionType
}

function AddInputs({ type }: Props): ReactElement {
  const sidebar = useSidebar()
  const [title, setTitle] = useState('')

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const onComplete = () => {
    if (!sidebar.actionActive) return
    sidebar.setActionComplete(true)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    onComplete()
    const { parentUrlSlug, bookUrlSlug, index, type } = sidebar.actionInfo
    if (type === '') return
    const event = new CustomEvent<CustomEventDetail['addActionEvent']>(
      nextraCustomEventName.addAction,
      {
        detail: { title, parentUrlSlug, index, bookUrlSlug, type },
      },
    )
    window.dispatchEvent(event)
  }

  const { ref } = useOutsideClick<HTMLDivElement>(onComplete)

  if (type === '') return <></>
  return (
    <div ref={ref} className={cn('nx-flex [word-break:break-word]')}>
      <span
        className={cn(
          'nx-text-gray-600 nx-transition-colors hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:nx-text-gray-400 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50',
        )}
      >
        {type === 'folder' && <EmptyFolderIcon />}
        {type === 'page' && <EmptyFileIcon />}
        {type === 'separator' && <SeparatorIcon />}
      </span>
      <input value={title} onChange={onChange} autoFocus={true} onKeyDown={onKeyDown} />
    </div>
  )
}

export default AddInputs
