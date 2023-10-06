import styles from './AuthSocialButton.module.css'
import { FacebookIcon, GithubIcon, GoogleIcon } from '@/assets/icons/components'
import { useMemo } from 'react'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { AuthProvider } from '@/types/auth'
import { ENV } from '@/env'

const cx = bindClassNames(styles)

type Props = {
  provider: AuthProvider
  tabIndex: number
  currentPath: string
}

const providerMap = (currentPath: string) => {
  return {
    github: {
      color: '#272e33',
      icon: GithubIcon,
      border: false,
      redirectTo: `${ENV.apiV2Host}/api/v2/auth/social/redirect/github?next=${currentPath}&isIntegrate=0`,
    },
    google: {
      color: 'white',
      icon: GoogleIcon,
      border: true,
      redirectTo: `${ENV.apiV3Host}/api/auth/v3/social/redirect/google?next=${currentPath}&isIntegrate=0`,
    },
    facebook: {
      color: '#3b5998',
      icon: FacebookIcon,
      border: false,
      redirectTo: `${ENV.apiV3Host}/api/auth/v3/social/redirect/facebook?next=${currentPath}&isIntegrate=0`,
    },
  }
}

function AuthSocialButton({ provider, tabIndex, currentPath }: Props) {
  const info = useMemo(() => providerMap(currentPath)[provider], [provider, currentPath])
  const { icon: Icon, color, border, redirectTo } = info

  return (
    <a
      className={cx('block', { border })}
      href={redirectTo}
      tabIndex={tabIndex}
      style={{
        background: color,
      }}
    >
      <Icon height="20px" width="20px" />
    </a>
  )
}

export default AuthSocialButton
