'use client'

import BasicLayout from '@/components/Layouts/BasicLayout'
import { useUserLoader } from '@/hooks/useUserLoader'

type Props = {
  children: React.ReactNode
}

export default function Home({ children }: Props) {
  useUserLoader()
  return <BasicLayout>{children}</BasicLayout>
}
