import { useEffect } from 'react'

export function useInfiniteScroll(ref: React.RefObject<HTMLElement>, fetchNext: () => void) {
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        fetchNext()
      },
      {
        root: null,
        rootMargin: '300px',
        threshold: 0.1,
      }
    )

    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [ref, fetchNext])
}
