import cn from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { Toolbar } from './toolbar'
import { useCodemirror } from '@/hooks'
import { useRouter } from 'next/router'
import { saveExecute } from './toolbar/commands/save'
import toast, { ToastOptions } from 'react-hot-toast'
import { CustomEventDetail } from '@/types'
import { markdownCustomEventName } from '@/index'

interface MarkdownEditorProps {}

export const MarkdownEditor = ({}: MarkdownEditorProps) => {
  const router = useRouter()
  const [isAutoSave, setAutoSave] = useState<boolean>(false)
  const [isFocus, setIsFocus] = useState<boolean>(false)
  const codemirror = useRef<HTMLDivElement | null>(null)
  const interval = useRef<NodeJS.Timeout | null>(null)
  const { state, view } = useCodemirror(codemirror, {
    autoFocus: true,
    minHeight: '100%',
    maxHeight: '100%',
  })

  // router 이동시 isFocus 초기화
  useEffect(() => {
    if (!isFocus) return
    setIsFocus(false)
  }, [router.asPath])

  // 라우터 변경 시 자동 저장
  useEffect(() => {
    if (!view) return
    if (!isFocus) return
    const handleRouteChange = () => {
      setAutoSave(true)
      saveExecute(view)
    }
    router.events.on('beforeHistoryChange', handleRouteChange)
    return () => {
      router.events.off('beforeHistoryChange', handleRouteChange)
    }
  }, [router, view])

  // 30초마다 자동 저장
  useEffect(() => {
    if (!view) return
    interval.current = setInterval(() => {
      setAutoSave(true)
      saveExecute(view)
    }, 30000) // 30초
    return () => {
      if (!interval.current) return
      clearInterval(interval.current)
    }
  }, [view])

  // 저장 되고 나면 toast 메시지
  useEffect(() => {
    const updateItemResult = (e: CustomEventInit<CustomEventDetail['updateItemResultEvent']>) => {
      if (!e.detail) return
      if (isAutoSave) {
        setAutoSave(false)
        return
      }

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

  const onClick = () => {
    view?.focus()
    setIsFocus(true)
  }

  return (
    <>
      <Toolbar state={state} view={view} />
      <div
        id="markdown-editor-codemirror"
        className={cn('markdown-editor-codemirror')}
        onClick={onClick}
        ref={codemirror}
        suppressHydrationWarning={true}
        suppressContentEditableWarning={true}
        style={{
          height:
            'calc(100vh - (var(--nextra-navbar-height)) - var(--nextra-editor-toolbar-height))',
        }}
      />
    </>
  )
}
