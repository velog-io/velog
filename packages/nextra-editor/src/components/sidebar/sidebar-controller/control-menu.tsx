import useOutsideClick from '@/hooks/use-outside-click'
import cn from 'clsx'
import { forwardRef, RefObject } from 'react'

type Props = {
  isOpen: boolean
}

const style = {
  list: cn('nx-w-full nx-p-3 hover:nx-bg-gray-100'),
}

const ControlMenu = forwardRef<HTMLDivElement, Props>(({ isOpen }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'nx-absolute nx-right-0 nx-top-0 nx-z-10 nx-py-2',
        'nx-bg-white',
        isOpen ? 'nx-visible' : 'nx-invisible',
      )}
    >
      <ul>
        <li className={style.list}>이름 바꾸기</li>
        <li className={style.list}>삭제</li>
      </ul>
    </div>
  )
})

export default ControlMenu
