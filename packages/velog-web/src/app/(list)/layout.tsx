import HomeLayout from '@/components/Layouts/HomeLayout'

type Props = {
  children: React.ReactNode
}

export default async function HomeListLayout({ children }: Props) {
  return <HomeLayout>{children}</HomeLayout>
}
