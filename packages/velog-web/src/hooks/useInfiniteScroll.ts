import { useEffect } from 'react'

export function useInfiniteScroll(
  ref: React.RefObject<any>,
  fetchNext: () => void
) {
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        fetchNext()
      },
      {
        root: null,
        rootMargin: '500px 0px 0px 0px',
        threshold: 0.1,
      }
    )

    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [ref, fetchNext])
}
