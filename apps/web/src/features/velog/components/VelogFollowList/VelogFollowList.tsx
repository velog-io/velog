import { FollowResult } from '@/graphql/server/generated/server'
import styles from './VelogFollowList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { VelogFollowItem } from '../VelogFollowItem'
const cx = bindClassNames(styles)

type Props = {
  data: FollowResult[]
}

function VelogFollowList({ data }: Props) {
  return (
    <ul className={cx('block')}>
      {data.map((followState) => (
        <VelogFollowItem
          key={followState.id}
          isFollowed={followState.is_followed}
          thumbnail={followState.profile.thumbnail!}
          description={followState.profile.short_bio}
          userId={followState.userId}
          username={followState.username}
          displayName={followState.profile.display_name}
        />
      ))}
    </ul>
  )
}

export default VelogFollowList
