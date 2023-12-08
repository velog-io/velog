import ResponsiveLayout from '@/components/Layouts/ResponsiveLayout'

type Props = {
  children: React.ReactNode
}

export default async function Layout({ children }: Props) {
  return <ResponsiveLayout>{children}</ResponsiveLayout>
}
