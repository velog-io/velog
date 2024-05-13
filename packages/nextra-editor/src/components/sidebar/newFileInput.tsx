import { ReactElement, useState } from 'react'
import cn from 'clsx'
import { EmptyFileIcon } from '../../nextra/icons/empty-file'

function NewFileInput(): ReactElement {
  const [value, setValue] = useState('')
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <li className={cn('[word-break:break-word] nx-flex nx-my-4')}>
      <span
        className={cn(
          'nx-transition-colors nx-text-gray-600 dark:nx-text-gray-400 hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50',
        )}
      >
        <EmptyFileIcon />
      </span>
      <input value={value} onChange={onChange} autoFocus={true} />
    </li>
  )
}

export default NewFileInput
