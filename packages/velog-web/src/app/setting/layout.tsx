import BasicLayout from '@/components/Layouts/BasicLayout'

type Props = {
  children: React.ReactNode
}

export default async function Layout({ children }: Props) {
  return <BasicLayout>{children}</BasicLayout>
}
