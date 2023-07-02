import BasicLayout from '@/components/Layouts/BasicLayout'
import HomeTab from '@/features/home/components/HomeTab/HomeTab'

type Props = {
  children: React.ReactNode
}

export default function Home({ children }: Props) {
  return <BasicLayout>{children}</BasicLayout>
}
