import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './HeaderLayout.module.css'
import Header from '@/components/Header/Header'
import FloatingHeader from '@/features/home/components/FloatingHeader'

const cx = bindClassNames(styles)

interface Props {
  children?: React.ReactNode
}

async function HeaderLayout({ children }: Props) {
  return (
    <div className={cx('block')}>
      <FloatingHeader header={<Header />} />
      <div className={cx('mainResponsive')}>
        <div className={cx('innerBlock')}>
          <Header />
          <div className={cx('mainWrapper')}>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderLayout
