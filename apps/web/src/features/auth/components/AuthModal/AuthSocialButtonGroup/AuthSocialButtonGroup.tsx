import AuthSocialButton from '@/features/auth/components/AuthModal/AuthSocialButton'
import styles from './AuthSocialButtonGroup.module.css'
import { AuthProvider } from '@/types/auth'

type Providers = { provider: AuthProvider; tabIndex: number }[]

const providers: Providers = [
  { provider: 'github', tabIndex: 4 },
  { provider: 'google', tabIndex: 5 },
  { provider: 'facebook', tabIndex: 6 },
]

function AuthSocialButtonGroup() {
  return (
    <div className={styles.block}>
      {providers.map(({ provider, tabIndex }) => (
        <AuthSocialButton key={provider} provider={provider} tabIndex={tabIndex} />
      ))}
    </div>
  )
}

export default AuthSocialButtonGroup
