'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import styles from './VelogSearchInput.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { Search2Icon } from '@/assets/icons/components'
import useToggle from '@/hooks/useToggle'
import useInput from '@/hooks/useInput'
import { debounce } from 'throttle-debounce'

const cx = bindClassNames(styles)

type Props = {
  query: string
  username: string
}

function VelogSearchInput({ query, username }: Props) {
  const [focus, toggleFocus] = useToggle(false)
  const [value, onChange] = useInput(query)

  const inputRef = useRef<HTMLInputElement>(null)

  const onSearch = useCallback((keyword: string) => {
    console.log('query', keyword)
  }, [])

  const debouncedSearch = useMemo(() => {
    return debounce(300, (keyword: string) => {
      onSearch(keyword)
    })
  }, [onSearch])

  const onClick = () => {
    if (!inputRef.current) return
    inputRef.current.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(value)
    }
  }

  useEffect(() => {
    debouncedSearch(value)
  }, [debouncedSearch, value])

  return (
    <div className={cx('block')}>
      <div className={cx('search', { focus })} onClick={onClick}>
        <Search2Icon />
        <input
          placeholder="검색어를 입력하세요"
          onFocus={toggleFocus}
          onBlur={toggleFocus}
          onKeyDown={onKeyDown}
          ref={inputRef}
          onChange={onChange}
          value={value}
          autoFocus={true}
        />
      </div>
    </div>
  )
}

export default VelogSearchInput
