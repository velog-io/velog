import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import cn from 'clsx'

import { PageType, useSidebar } from '@/contexts/sidebar'
import useOutsideClick from '@/hooks/use-outside-click'
import { EmptyFolderIcon } from '@/nextra/icons/empty-folder'
import { EmptyFileIcon } from '@/nextra/icons/empty-file'
import { SeparatorIcon } from '@/nextra/icons/separator'
import { type CustomEventDetail, nextraCustomEventName } from '@/index'
import { useDebouncedCallback } from 'use-debounce'

type Props = {
  type: PageType
}

export function ControlInput({ type }: Props): ReactElement {
  const {
    isActionActive,
    actionInfo,
    isAddAction,
    isEditAction,
    originSortableItems,
    setSortableItems,
    reset,
  } = useSidebar()

  const [input, setInput] = useState<string | null>(null)
  const [error, setError] = useState('')

  const nameMapper: Record<PageType, string> = {
    folder: '폴더',
    page: '페이지',
    separator: '구분선',
    '': '',
  }

  const forbiddenCharsRegex = /[<>#%"{}|\^~\[\]`\/:@=&+$,;!*()\\']/
  const typeName = nameMapper[type]

  // validate title
  useEffect(() => {
    if (input === null || input === '') return
    if (forbiddenCharsRegex.test(input)) {
      setError(`${typeName} 이름에 사용해서는 안 되는 기호가 포함되어 있습니다.`)
    } else if (input === '') {
      setError(`${typeName} 이름을 입력해야 합니다.`)
    } else if (input.startsWith(' ')) {
      setError(`${typeName} 이름은 공백으로 시작할 수 없습니다.`)
    } else {
      setError('')
    }
  }, [input])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    // 두개 이상의 공백은 하나의 공백으로 변경
    const value = e.target.value.replace(/\s\s+/g, ' ').trimStart()
    setInput(value)
  }

  const onOutsideClick = (e?: MouseEvent) => {
    e?.preventDefault()
    if (!isActionActive) return
    if (actionInfo === null) return
    if (!isAddAction(actionInfo)) return

    if (input) {
      dispatchEvent()
    } else {
      setSortableItems(originSortableItems) // cancel
    }
    reset()
    setInput('')
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    dispatchEvent()
    reset()
    setInput('')
  }

  const dispatchEvent = useDebouncedCallback(
    useCallback(() => {
      if (type === '') return
      if (input === null) return
      if (input.trim() === '') return
      if (error) return
      if (actionInfo === null) return

      if (isAddAction(actionInfo)) {
        const { parentUrlSlug, bookUrlSlug, index, type } = actionInfo
        const event = new CustomEvent<CustomEventDetail['createItemEvent']>(
          nextraCustomEventName.createItemEvent,
          {
            detail: { title: input, parentUrlSlug, index, bookUrlSlug, type },
          },
        )
        window.dispatchEvent(event)
      }

      if (isEditAction(actionInfo)) {
        const { pageUrlSlug } = actionInfo
        const event = new CustomEvent<CustomEventDetail['updateItemEvent']>(
          nextraCustomEventName.updateItemEvent,
          {
            detail: { title: input, pageUrlSlug },
          },
        )
        window.dispatchEvent(event)
      }
    }, [input, error, actionInfo, type]),
    1000,
    { leading: true },
  )

  const { ref } = useOutsideClick<HTMLDivElement>((e) => onOutsideClick(e))
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
        value={input === null ? '' : input}
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
            'dark:nx-bg-dark',
            'nx-px-2',
          )}
        >
          <div className={cn('nx-border dark:nx-border-gray-100/20', 'nx-px-2 nx-py-1')}>
            {error}
          </div>
        </div>
      )}
    </div>
  )
}
