'use client'

import { PostLikeNotificationAction } from '@/graphql/helpers/generated'
import itemStyles from '../NotificationItem.module.css'
import styles from './PostLikeActionItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { NotificationMerged } from '@/features/notification/hooks/useNotificationMerge'
import Thumbnail from '@/components/Thumbnail'
import Link from 'next/link'
import { useTimeFormat } from '@/hooks/useTimeFormat'

const cx = bindClassNames({ ...itemStyles, ...styles })

type Props = { action: PostLikeNotificationAction } & NotificationMerged

function PostLikeActionItem(props: Props) {
  const { is_merged } = props
  if (is_merged) return <PostLikeMergedItem {...props} />
  return <PostLikeNotMergedItem {...props} />
}

function PostLikeNotMergedItem(props: Props) {
  const { action, created_at } = props
  const {
    actor_username,
    actor_display_name,
    actor_thumbnail,
    post_writer_username,
    post_url_slug,
    post_title,
  } = action
  const velogUrl = `/@${actor_username}/posts`
  const { time } = useTimeFormat(created_at)
  return (
    <li className={cx('block', 'item')}>
      <Link href={velogUrl}>
        <Thumbnail className={cx('thumbnail')} src={actor_thumbnail} alt={actor_display_name} />
      </Link>
      <div className={cx('content')}>
        <p className={cx('wrap')}>
          <Link href={`/@${actor_username}/posts`}>
            <span className={cx('bold')}>{actor_display_name}</span>
          </Link>
          <span className={cx('spacer')} />
          <span className={cx('postTitle', 'bold')}>
            <Link href={`/@${post_writer_username}/${post_url_slug}`}>
              {post_title.length > 20 ? `${post_title.slice(0, 20)}...` : post_title}
            </Link>
          </span>
          <span className={cx('spacer')} />
          <span>포스트를 좋아 합니다.</span>
          <span className={cx('time')}>{time}</span>
        </p>
      </div>
    </li>
  )
}

function PostLikeMergedItem(props: Props) {
  const { action, created_at, actor_info, action_count } = props
  const rest_action_count = action_count - 2
  const { post_title, post_writer_username, post_url_slug } = action
  const { time } = useTimeFormat(created_at)

  return (
    <li className={cx('block', 'item')}>
      <div className={cx('thumbanils')}>
        {actor_info.map((info, i) => {
          return (
            <Link href={`/@${info.username}/posts`} key={info.username}>
              <Thumbnail key={i} src={info.thumbnail} className={cx('thumbanil')} />
            </Link>
          )
        })}
      </div>
      <div className={cx('content')}>
        <p className={cx('wrap')}>
          {actor_info.map((info, i) => {
            return (
              <Link href={`/@${info.username}/posts`} key={info.username}>
                <span className={cx('bold')}>{info.display_name}</span>
                {actor_info.length - 1 !== i && (
                  <span>
                    ,
                    <span className={cx('spacer')} />
                  </span>
                )}
              </Link>
            )
          })}
          <span>
            {' '}
            {rest_action_count > 0 && <>님 외 {rest_action_count}명이</>}
            {rest_action_count <= 0 && <>님이</>}
          </span>
          <span className={cx('spacer')} />
          <span className={cx('postTitle', 'bold')}>
            <Link href={`/@${post_writer_username}/${post_url_slug}`}>
              {post_title.length > 20 ? `${post_title.slice(0, 20)}...` : post_title}
            </Link>
          </span>
          <span className={cx('spacer')} />
          <span>포스트를 좋아 합니다.</span>
          <span className={cx('time')}>{time}</span>
        </p>
      </div>
    </li>
  )
}

export default PostLikeActionItem
