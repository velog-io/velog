import { useUserLoader } from '@/hooks/useUserLoader'

type Props = {
  children: React.ReactNode
}

function UserLoaderProvider({ children }: Props) {
  useUserLoader()
  return <>{children}</>
}

export default UserLoaderProvider
