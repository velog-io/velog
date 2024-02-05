'use client'

import styles from './VelogLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

import VelogTab from '@/features/velog/components/VelogTab'
import MobileSeparator from '@/features/velog/components/MobileSeparator'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
  userProfile: React.ReactNode
}

function VelogLayout({ children, userProfile }: Props) {
  return (
    <div className={cx('block')}>
      {userProfile}
      <MobileSeparator />
      <VelogTab />
      <section className={cx('section')}>{children}</section>
    </div>
  )
}

export default VelogLayout
