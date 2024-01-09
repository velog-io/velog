import HomeLayout from '@/components/Layouts/HomeLayout'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return <HomeLayout>{children}</HomeLayout>
}
