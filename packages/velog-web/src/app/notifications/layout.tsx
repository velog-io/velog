import SmallLayout from '@/components/Layouts/SmallLayout'
import { Metadata } from 'next'

type Props = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: '알림 - velog',
}

// TODO: remove a line using react-query prefetch
export const dynamic = 'force-dynamic'

export default async function NotificationLayout({ children }: Props) {
  return <SmallLayout>{children}</SmallLayout>
}
