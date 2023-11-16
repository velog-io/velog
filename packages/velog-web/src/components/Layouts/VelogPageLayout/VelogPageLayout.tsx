'use client'

import Header from '@/components/Header'
import styles from './VelogPageLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import FloatingHeader from '@/features/home/components/FloatingHeader'
import HeaderCustomLogo from '@/components/Header/HeaderCustomLogo'
import { UserLogo } from '@/state/header'

import VelogTab from '@/features/velog/components/VelogTab'
import MobileSeparator from '@/features/velog/components/MobileSeparator'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
  username: string
  userLogo: UserLogo
  userProfile: React.ReactNode
}

function VelogPageLayout({ username, children, userLogo, userProfile }: Props) {
  const header = <Header logo={<HeaderCustomLogo username={username} userLogo={userLogo} />} />
  return (
    <div className={cx('block')}>
      <FloatingHeader header={header} />
      <div className={cx('mainResponsive')}>
        {header}
        <main className={cx('mainWrapper')}>
          {userProfile}
          <MobileSeparator />
          <VelogTab username={username} />
          <section className={cx('section')}>{children}</section>
        </main>
      </div>
    </div>
  )
}

export default VelogPageLayout
