'use client'

import Header from '@/components/Header'
import styles from './VelogFollowLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import FloatingHeader from '@/features/home/components/FloatingHeader'
import HeaderCustomLogo from '@/components/Header/HeaderCustomLogo'
import { UserLogo } from '@/state/header'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
  username: string
  userLogo: UserLogo
}

function VelogFollowLayout({ username, children, userLogo }: Props) {
  const header = <Header logo={<HeaderCustomLogo username={username} userLogo={userLogo} />} />
  return (
    <div className={cx('block')}>
      <FloatingHeader header={header} />
      <div className={cx('mainResponsive')}>
        {header}
        <main className={cx('mainWrapper')}>
          <section className={cx('section')}>{children}</section>
        </main>
      </div>
    </div>
  )
}

export default VelogFollowLayout
