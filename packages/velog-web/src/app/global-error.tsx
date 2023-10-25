'use client'

import ChunkErrorScreen from '@/components/Error/ChunkErrorScreen'
import CrashErrorScreen from '@/components/Error/CrashErrorScreen'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('global error', error)
  }, [error])

  if (error) {
    return <CrashErrorScreen />
  }

  return <ChunkErrorScreen reset={reset} />
}
