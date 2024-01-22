import SmallLayout from '@/components/Layouts/SmallLayout'
import { Metadata } from 'next'

type Props = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'notifications - velog',
}

export default async function NotificationLayout({ children }: Props) {
  return <SmallLayout>{children}</SmallLayout>
}
