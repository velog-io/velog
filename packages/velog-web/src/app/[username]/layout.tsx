import HeaderLayout from '@/components/Layouts/HeaderLayout'
import VelogPageLayout from '@/components/Layouts/VelogPageLayout'

type Props = {
  children: React.ReactNode
}

export default function VelogLayout({ children }: Props) {
  return <VelogPageLayout>{children}</VelogPageLayout>
}
