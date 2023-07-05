import styles from './AuthSocialButton.module.css'
import { FacebookIcon, GithubIcon, GoogleIcon } from '@/public/svg'
import { useMemo } from 'react'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { AuthProvider } from '@/types/auth'
import Image from 'next/image'

const cx = bindClassNames(styles)

type Props = {
  provider: AuthProvider
  tabIndex: number
  currentPath: string
}

const providerMap = {
  github: {
    color: '#272e33',
    icon: '/svg/icon-github.svg',
    border: false,
    alt: 'github-button',
  },
  google: {
    color: 'white',
    icon: '/svg/icon-google.svg',
    border: true,
    alt: 'google-button',
  },
  facebook: {
    color: '#3b5998',
    icon: '/svg/icon-facebook.svg',
    border: false,
    alt: 'facebook-button',
  },
}

function AuthSocialButton({ provider, tabIndex, currentPath }: Props) {
  const info = useMemo(() => providerMap[provider], [provider])
  const { icon, color, border, alt } = info

  const host =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_V2_HOST
      : 'http://localhost:5002/'

  const redirectTo = `${host}api/v2/auth/social/redirect/${provider}?next=${currentPath}&isIntegrate=0`

  return (
    <a
      className={cx('block', { border })}
      href={redirectTo}
      tabIndex={tabIndex}
      style={{
        background: color,
      }}
    >
      <Image src={icon} alt={alt} width={20} height={20} />
    </a>
  )
}

export default AuthSocialButton
