'use client'

import { NotificationNotMerged } from '@/features/notification/hooks/useNotificationMerge'
import itemStyles from '../NotificationItem.module.css'
import styles from './FollowerActionItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { FollowerNotificationAction } from '@/graphql/helpers/generated'
import { useTimeFormat } from '@/hooks/useTimeFormat'
import Link from 'next/link'
import Thumbnail from '@/components/Thumbnail'
import FollowButton from '@/components/FollowButton'

const cx = bindClassNames({ ...itemStyles, ...styles })

type Props = { action: FollowerNotificationAction } & NotificationNotMerged

function FollowerActionItem({ action, created_at }: Props) {
  const { actor_display_name, actor_thumbnail, actor_username, actor_user_id } = action

  const velogUrl = `/@${actor_username}/posts`
  const { time } = useTimeFormat(created_at)

  return (
    <li className={cx('block', 'item')}>
      <Link href={velogUrl}>
        <Thumbnail className={cx('thumbnail')} src={actor_thumbnail} alt={actor_display_name} />
      </Link>
      <div className={cx('content')}>
        <p className={cx('wrap')}>
          <Link href={velogUrl}>
            <span className={cx('bold')}>{actor_display_name}</span>
          </Link>
          <span className={cx('spacer')} />
          <span className={cx('wrap')}>님이 회원님을 팔로우 하였습니다.</span>
          <span className={cx('spacer')} />
          <span className={cx('time', 'nowrap')}>{time}</span>
        </p>
      </div>
      <div className={cx('button')}>
        <FollowButton followingUserId={actor_user_id} />
      </div>
    </li>
  )
}

export default FollowerActionItem
