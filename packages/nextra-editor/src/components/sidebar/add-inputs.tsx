import { ReactElement, useState } from 'react'
import cn from 'clsx'

import { ActionType, useSidebar } from '../../contexts/sidebar'
import useOutsideClick from '../../hooks/use-outside-click'
import { CustomEventDetail, nextraCustomEventName } from '../..'
import { EmptyFolderIcon } from '../../nextra/icons/empty-folder'
import { EmptyFileIcon } from '../../nextra/icons/empty-file'
import { SeparatorIcon } from '../../nextra/icons/separator'

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
    onComplete()
    const { parentUrlSlug, bookUrlSlug, index, type } = sidebar.actionInfo
    if (type === '') return
    const event = new CustomEvent<CustomEventDetail['AddActionEventDetail']>(
      nextraCustomEventName.addAction,
      {
        detail: { title, parentUrlSlug, index, bookUrlSlug, type },
      },
    )
    window.dispatchEvent(event)
  }

  const { ref } = useOutsideClick<HTMLLIElement>(onComplete)

  if (type === '') return <></>
  return (
    <li ref={ref} className={cn('[word-break:break-word] nx-flex nx-my-4')}>
      <span
        className={cn(
          'nx-transition-colors nx-text-gray-600 dark:nx-text-gray-400 hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50',
        )}
      >
        {type === 'folder' && <EmptyFolderIcon />}
        {type === 'page' && <EmptyFileIcon />}
        {type === 'separator' && <SeparatorIcon />}
      </span>
      <input value={title} onChange={onChange} autoFocus={true} onKeyDown={onKeyDown} />
    </li>
  )
}

export default AddInputs
