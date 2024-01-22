import BasicLayout from '@/components/Layouts/BasicLayout'
import TrendingWriterLayout from '@/components/Layouts/TrendingWriterLayout'
import { Metadata } from 'next'

type Props = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'trending writers - velog',
}

export default function Layout({ children }: Props) {
  return (
    <BasicLayout isCustomHeader={false}>
      <TrendingWriterLayout>{children}</TrendingWriterLayout>
    </BasicLayout>
  )
}
