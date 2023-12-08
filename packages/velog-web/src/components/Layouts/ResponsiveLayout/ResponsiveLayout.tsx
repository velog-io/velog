import styles from './ResponsiveLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import FloatingHeader from '@/features/home/components/FloatingHeader'
import Header from '@/components/Header'
import { UserLogo } from '@/state/header'
import HeaderCustomLogo from '@/components/Header/HeaderCustomLogo'

const cx = bindClassNames(styles)

type DefaultProps = {
  children: React.ReactNode
  isCustomHeader: false
}

type CustomLogoHeaderProps = {
  children: React.ReactNode
  username: string
  userLogo: UserLogo
  isCustomHeader: true
}

type Props = DefaultProps | CustomLogoHeaderProps

function isDefaultProps(props: Props): props is DefaultProps {
  return !props.isCustomHeader
}

// main wrapper의 넓이가 768px
function ResponsiveLayout(props: Props) {
  const header = isDefaultProps(props) ? (
    <Header />
  ) : (
    <Header logo={<HeaderCustomLogo username={props.username} userLogo={props.userLogo} />} />
  )

  return (
    <div className={cx('block')}>
      <FloatingHeader header={header} />
      <div className={cx('mainResponsive')}>
        {header}
        <div className={cx('mainWrapper')}>
          <main>{props.children}</main>
        </div>
      </div>
    </div>
  )
}

export default ResponsiveLayout
