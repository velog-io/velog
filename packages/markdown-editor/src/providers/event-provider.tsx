import cn from 'clsx'
import { useEffect } from 'react'
import { type CustomEventDetail, markdownCustomEventName } from '..'
import toast, { type ToastOptions } from 'react-hot-toast'

export const EventProvider = () => {
  useEffect(() => {
    const updateItemResult = (e: CustomEventInit<CustomEventDetail['updateItemResultEvent']>) => {
      if (!e.detail) return
      const { result } = e.detail

      const commonOption: ToastOptions = {
        className: cn('dark:nx-bg-[#333] dark:nx-text-[#f0f0f0]'),
        style: {
          fontSize: '17px',
        },
        duration: 700,
      }

      const mapper = {
        success: () =>
          toast.success('글이 저장 되었습니다', {
            position: 'bottom-right',
            ...commonOption,
          }),
        error: () =>
          toast.error('글 저장에 실패했습니다', {
            position: 'bottom-right',
            ...commonOption,
          }),
      }

      mapper[result]()
    }

    window.addEventListener(markdownCustomEventName.updateItemResultEvent, updateItemResult)
    return () => {
      window.removeEventListener(markdownCustomEventName.updateItemResultEvent, updateItemResult)
    }
  }, [])
  return <></>
}
