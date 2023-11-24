import styles from './HeaderSkeleton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  logo: React.ReactNode
}

function HeaderSkeleton({ logo }: Props) {
  return (
    <div className={cx('block', 'mainHeaderResponsive')}>
      <div className={cx('innerBlock')}>
        {logo}
        <div className={cx('right')}>
          <div className={cx('button')} />
          <div className={cx('button')} />
          <div className={cx('button', 'writeButton')} />
          <div className={cx('button')} />
        </div>
      </div>
    </div>
  )
}

export default HeaderSkeleton
