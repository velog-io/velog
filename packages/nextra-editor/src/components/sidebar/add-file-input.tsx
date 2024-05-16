import { ReactElement, useState } from 'react'
import cn from 'clsx'
import { EmptyFileIcon } from '../../nextra/icons/empty-file'
import { useSidebar } from '../../contexts/sidebar'
import useOutsideClick from '../../hooks/useOutsideClick'
import { CustomEventDetail, nextraCustomEventName } from '../..'

function addFileInput(): ReactElement {
  const sidebar = useSidebar()
  const [title, setTitle] = useState('')

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const onComplete = () => {
    if (!sidebar.addFileActive) return
    sidebar.setAddFileComplete(true)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onComplete()
      const { parentUrlSlug, bookUrlSlug, index } = sidebar.addFileInfo
      const event = new CustomEvent<CustomEventDetail['AddFileEventDetail']>(
        nextraCustomEventName.addFile,
        {
          detail: { title, parentUrlSlug, index, bookUrlSlug },
        },
      )
      window.dispatchEvent(event)
    }
  }

  const { ref } = useOutsideClick<HTMLLIElement>(onComplete)

  return (
    <li ref={ref} className={cn('[word-break:break-word] nx-flex nx-my-4')}>
      <span
        className={cn(
          'nx-transition-colors nx-text-gray-600 dark:nx-text-gray-400 hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50',
        )}
      >
        <EmptyFileIcon />
      </span>
      <input value={title} onChange={onChange} autoFocus={true} onKeyDown={onKeyDown} />
    </li>
  )
}

export default addFileInput
