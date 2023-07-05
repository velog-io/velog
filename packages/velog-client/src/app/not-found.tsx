'use client'

import useCurrentPath from '@/hooks/useCurrentPath'

export default function NotFound() {
  const { currentPath } = useCurrentPath()
  window.location.href = `${process.env.NEXT_PUBLIC_CLIENT_V2_HOST}${currentPath}`
  return <></>
}
