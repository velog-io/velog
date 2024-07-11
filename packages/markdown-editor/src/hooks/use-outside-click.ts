import { useEffect, useRef } from 'react'

export function useOutsideClick<T extends Element>(callback: (event?: MouseEvent) => any) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as any)) {
        callback(event)
      }
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [ref, callback])

  return { ref }
}
