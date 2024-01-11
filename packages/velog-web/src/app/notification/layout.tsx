import BasicLayout from '@/components/Layouts/BasicLayout'

type Props = {
  children: React.ReactNode
}

export default async function NotificationLayout({ children }: Props) {
  return <BasicLayout>{children}</BasicLayout>
}
