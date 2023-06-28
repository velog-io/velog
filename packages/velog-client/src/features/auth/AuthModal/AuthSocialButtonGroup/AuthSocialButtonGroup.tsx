import AuthSocialButton from '@/features/auth/AuthModal/AuthSocialButton/AuthSocialButton'
import styles from './AuthSocialButtonGroup.module.css'
import { AuthProvider } from '@/types/auth'
import { usePathname, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

type Providers = { provider: AuthProvider; tabIndex: number }[]

const providers: Providers = [
  { provider: 'github', tabIndex: 4 },
  { provider: 'google', tabIndex: 5 },
  { provider: 'facebook', tabIndex: 6 },
]

function AuthSocialButtonGroup() {
  const pathname = usePathname()
  const search = useSearchParams()

  const currentPath = useMemo(() => {
    const query = search.toString()
    return `${pathname === '/' ? '' : pathname}${query ? `?${query}` : ''}`
  }, [pathname, search])

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
