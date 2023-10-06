'use client'

import { useEffect } from 'react'

export function useInfiniteScroll(
  ref: React.RefObject<HTMLElement>,
  fetchNext: () => void,
  isError: boolean,
) {
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        if (isError) return
        fetchNext()
      },
      {
        threshold: 0.1,
      },
    )

    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [ref, fetchNext, isError])
}
