import HeaderLayout from '@/components/Layouts/HeaderLayout'

type Props = {
  children: React.ReactNode
}

export default function VelogLayout({ children }: Props) {
  return <HeaderLayout>{children}</HeaderLayout>
}
