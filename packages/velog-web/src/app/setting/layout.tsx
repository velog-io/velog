import BasicLayout from '@/components/Layouts/BasicLayout'
import SettingLayout from '@/components/Layouts/SettingLayout'

type Props = {
  children: React.ReactNode
}

// TODO: remove a line using react-query prefetch
export const dynamic = 'force-dynamic'

export default async function Layout({ children }: Props) {
  return (
    <BasicLayout>
      <SettingLayout>{children}</SettingLayout>
    </BasicLayout>
  )
}
