import Header from '@/components/Header'
import styles from './VelogPageLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import FloatingHeader from '@/features/home/components/FloatingHeader'
import UserProfile from '@/components/UserProfile'
import { ProfileLinks } from '@/types/user'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
  displayName: string
  shortBio: string
  profileLikns: ProfileLinks
  username: string
  thumbnail: string | null
}

function VelogPageLayout({
  displayName,
  shortBio,
  profileLikns,
  username,
  thumbnail,
  children,
}: Props) {
  return (
    <div className={cx('block')}>
      <FloatingHeader />
      <div className={cx('mainResponsive')}>
        <div className={cx('innerBlock')}>
          <Header />
          <div className={cx('mainWrapper')}>
            <main>
              <UserProfile
                displayName={displayName}
                shortBio={shortBio}
                profileLinks={profileLikns as ProfileLinks}
                thumbnail={thumbnail}
                username={username}
              />
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VelogPageLayout
