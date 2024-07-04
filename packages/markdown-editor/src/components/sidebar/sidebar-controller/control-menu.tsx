import { EditIcon } from '@/nextra/icons/edit'
import { TrashIcon } from '@/nextra/icons/trash'
import cn from 'clsx'
import { forwardRef } from 'react'

type Props = {
  isOpen: boolean
  position: { top: number; left: number }
  onEdit: () => void
  onDelete: () => void
}

const style = {
  list: cn(
    'nx-w-full nx-flex nx-items-center nx-p-3 hover:nx-bg-gray-100 dark:hover:nx-bg-neutral-700',
    'nx-cursor-pointer nx-select-none',
  ),
  svg: cn('nx-mr-2'),
}

export const ControlMenu = forwardRef<HTMLDivElement, Props>(
  ({ isOpen, position, onEdit, onDelete }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'nx-absolute nx-z-20 nx-rounded-md nx-py-2 nx-shadow-lg',
          'nx-text-sm',
          'nx-bg-white nx-text-gray-600',
          'dark:nx-bg-neutral-800 dark:nx-text-gray-300',
        )}
        style={{ top: position.top, left: 260, display: isOpen ? 'block' : 'none' }}
      >
        <ul>
          <li className={style.list} onClick={onEdit}>
            <EditIcon className={style.svg} />
            <span>이름 바꾸기</span>
          </li>
          <li className={style.list} onClick={onDelete}>
            <TrashIcon className={style.svg} />
            <span>삭제</span>
          </li>
        </ul>
      </div>
    )
  },
)
