'use client'

import styles from './RequireLogin.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import ErrorScreenTemplate from '@/components/Error/ErrorScreenTemplate'
import { UndrawLogin } from '@/assets/vectors/components'
import { useModal } from '@/state/modal'
import { useEffect } from 'react'
import { useAuth } from '@/state/auth'
import { usePathname, useRouter } from 'next/navigation'

const cx = bindClassNames(styles)

type Props = {
  redirectTo?: string
}

function RequireLogin({ redirectTo }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const { actions } = useModal()

  const redirectToPath = redirectTo || pathname

  const {
    value: { currentUser },
  } = useAuth()

  const onButtonClick = () => {
    actions.showModal('login', redirectToPath)
  }

  useEffect(() => {
    if (!currentUser) return
    router.push(redirectToPath)
  }, [router, currentUser, redirectToPath])

  return (
    <div className={cx('block')}>
      <ErrorScreenTemplate
        Illustration={UndrawLogin}
        message="로그인 후 이용해주세요."
        onButtonClick={onButtonClick}
        buttonText="로그인"
      />
    </div>
  )
}

export default RequireLogin
