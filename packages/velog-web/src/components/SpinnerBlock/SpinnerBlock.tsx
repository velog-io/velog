'use client'

import styles from './SpinnerBlock.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function SpinnerBlock({}: Props) {
  return (
    <div className={cx('block')}>
      <div className={cx('sk-chase-dot')} />
      <div className={cx('sk-chase-dot')} />
      <div className={cx('sk-chase-dot')} />
      <div className={cx('sk-chase-dot')} />
      <div className={cx('sk-chase-dot')} />
      <div className={cx('sk-chase-dot')} />
    </div>
  )
}

export default SpinnerBlock
