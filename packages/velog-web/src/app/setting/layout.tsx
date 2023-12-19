import BasicLayout from '@/components/Layouts/BasicLayout'
import SettingLayout from '@/components/Layouts/SettingLayout'

type Props = {
  children: React.ReactNode
}

export default async function Layout({ children }: Props) {
  return (
    <BasicLayout>
      <SettingLayout>{children}</SettingLayout>
    </BasicLayout>
  )
}
