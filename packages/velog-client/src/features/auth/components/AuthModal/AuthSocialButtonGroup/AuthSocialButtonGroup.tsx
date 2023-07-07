import AuthSocialButton from '@/features/auth/components/AuthModal/AuthSocialButton'
import styles from './AuthSocialButtonGroup.module.css'
import { AuthProvider } from '@/types/auth'
import useCurrentPath from '@/hooks/useCurrentPath'

type Providers = { provider: AuthProvider; tabIndex: number }[]

const providers: Providers = [
  { provider: 'github', tabIndex: 4 },
  { provider: 'google', tabIndex: 5 },
  { provider: 'facebook', tabIndex: 6 },
]

function AuthSocialButtonGroup() {
  const { currentPath } = useCurrentPath()

  return (
    <div className={styles.block}>
      {providers.map(({ provider, tabIndex }) => (
        <AuthSocialButton
          key={provider}
          provider={provider}
          tabIndex={tabIndex}
          currentPath={currentPath}
        />
      ))}
    </div>
  )
}

export default AuthSocialButtonGroup
