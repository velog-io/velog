import React, { ReactElement, useEffect, useState } from 'react'
import cn from 'clsx'

import { ActionType, useSidebar } from '@/contexts/sidebar'
import useOutsideClick from '@/hooks/use-outside-click'
import { EmptyFolderIcon } from '@/nextra/icons/empty-folder'
import { EmptyFileIcon } from '@/nextra/icons/empty-file'
import { SeparatorIcon } from '@/nextra/icons/separator'
import { type CustomEventDetail, nextraCustomEventName } from '@/index'
import { useDebouncedCallback } from 'use-debounce'

type Props = {
  type: ActionType
}

function ControlInput({ type }: Props): ReactElement {
  const sidebar = useSidebar()
  const [title, setTitle] = useState<string | null>(null)
  const [error, setError] = useState('')

  const nameMapper: Record<ActionType, string> = {
    folder: '폴더',
    page: '페이지',
    separator: '구분선',
    '': '',
  }

  const forbiddenCharsRegex = /[<>#%"{}|\^~\[\]`\/:@=&+$,;!*()\\']/
  const typeName = nameMapper[type]

  useEffect(() => {
    if (title === null) return
    if (forbiddenCharsRegex.test(title)) {
      setError(`${typeName} 이름에 사용해서는 안 되는 기호가 포함되어 있습니다.`)
    } else if (title === '') {
      setError(`${typeName} 이름을 입력해야 합니다.`)
    } else {
      setError('')
    }
  }, [title])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    // 두개 이상의 공백은 하나의 공백으로 변경
    const value = e.target.value.replace(/\s\s+/g, ' ').trim()
    setTitle(value)
  }

  const onComplete = () => {
    if (!sidebar.actionActive) return
    setTitle('')
    dispatchEvent()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault()
      setTitle((title) => `${title} `)
      return
    }
    if (e.key !== 'Enter') return
    e.preventDefault()
    dispatchEvent()
  }

  const dispatchEvent = useDebouncedCallback(
    () => {
      const { parentUrlSlug, bookUrlSlug, index, type } = sidebar.actionInfo
      if (type === '') return
      if (!title) return
      if (error) return
      const event = new CustomEvent<CustomEventDetail['addActionEvent']>(
        nextraCustomEventName.addActionEvent,
        {
          detail: { title, parentUrlSlug, index, bookUrlSlug, type },
        },
      )
      window.dispatchEvent(event)
      sidebar.reset()
    },
    1000,
    { leading: true },
  )

  const { ref } = useOutsideClick<HTMLDivElement>(onComplete)

  if (type === '') return <></>
  return (
    <div
      ref={ref}
      className={cn(
        'nextra-control-input',
        'nx-flex nx-w-full nx-items-center nx-px-2 nx-py-1.5 [word-break:break-word]',
        'nx-relative nx-transition-colors',
      )}
    >
      <span>
        {type === 'folder' && <EmptyFolderIcon />}
        {type === 'page' && <EmptyFileIcon />}
        {type === 'separator' && <SeparatorIcon />}
      </span>
      <input
        className={cn(
          'nextra-add-contents-input',
          'focus-visible:box-shadow-none nx-ml-1 nx-w-full nx-px-1 nx-py-0.5',
          'nx-bg-gray-100 nx-text-gray-600 ',
          'dark:nx-bg-primary-100/5 dark:nx-text-gray-400',
        )}
        value={title === null ? '' : title}
        onChange={onChange}
        onKeyDown={onKeyDown}
        autoFocus={true}
        style={{
          boxShadow: 'none',
        }}
      />
      {error && (
        <div
          className={cn(
            'nx-absolute nx-left-0 nx-top-[35px] nx-z-10 nx-w-full',
            'nx-bg-white nx-text-[12px] nx-font-medium nx-text-gray-500',
            'nx-px-2',
          )}
        >
          <div
            className={cn(
              'nx-border dark:nx-border-gray-100/20 dark:nx-bg-dark/50 ',
              'nx-px-2 nx-py-1',
            )}
          >
            {error}
          </div>
        </div>
      )}
    </div>
  )
}

export default ControlInput
