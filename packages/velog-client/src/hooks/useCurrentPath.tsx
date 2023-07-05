import { usePathname, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export default function useCurrentPath() {
  const pathname = usePathname()
  const search = useSearchParams()

  const currentPath = useMemo(() => {
    const query = search.toString()
    return `${pathname === '/' ? '' : pathname}${query ? `?${query}` : ''}`
  }, [pathname, search])

  return { currentPath }
}
