'use client'

import { useUserLoader } from '@/hooks/useUserLoader'

type Props = {
  children: React.ReactNode
}

function UserContextProvider({ children }: Props) {
  useUserLoader()
  return <>{children}</>
}

export default UserContextProvider
