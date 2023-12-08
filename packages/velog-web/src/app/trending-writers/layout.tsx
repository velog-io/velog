import ResponsiveLayout from '@/components/Layouts/ResponsiveLayout'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return <ResponsiveLayout isCustomHeader={false}>{children}</ResponsiveLayout>
}
