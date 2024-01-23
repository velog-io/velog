'use client'

import { PostLikeNotificationAction, useNotificationCountQuery } from '@/graphql/helpers/generated'
import itemStyles from '../NotificationItem.module.css'
import styles from './PostLikeActionItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { NotificationMerged } from '@/features/notification/hooks/useNotificationMerge'
import Thumbnail from '@/components/Thumbnail'
import Link from 'next/link'
import { useTimeFormat } from '@/hooks/useTimeFormat'
import React, { useState } from 'react'

const cx = bindClassNames({ ...itemStyles, ...styles })

type Props = {
  action: PostLikeNotificationAction
  onClickNotification: (notificationIds: string[]) => Promise<void>
} & NotificationMerged

type ItemProps = {
  onListClick: (notificationIds: string[]) => void
} & Props

function PostLikeActionItem(props: Props) {
  const { is_merged, onClickNotification } = props
  const { refetch } = useNotificationCountQuery()

  const onListClick = (notificationIds: string[]) => {
    onClickNotification(notificationIds)
    console.log('refetch')
    refetch()
  }

  if (is_merged) return <PostLikeMergedItem {...props} onListClick={onListClick} />
  return <PostLikeNotMergedItem {...props} onListClick={onListClick} />
}

function PostLikeNotMergedItem(props: ItemProps) {
  const { id, action, created_at, is_read, onListClick } = props
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
  const [isClick, setClick] = useState(false)

  const onClick = () => {
    onListClick([id])
    setClick(true)
  }

  return (
    <li className={cx('block', 'item', { isRead: is_read || isClick })} onClick={onClick}>
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

function PostLikeMergedItem(props: ItemProps) {
  const { action, created_at, actor_info, action_count, is_read, onListClick, notificationIds } =
    props
  const rest_action_count = action_count - 2
  const { post_title, post_writer_username, post_url_slug } = action
  const { time } = useTimeFormat(created_at)
  const [isClick, setClick] = useState(false)

  const onClick = () => {
    onListClick(notificationIds)
    setClick(true)
  }

  return (
    <li className={cx('block', 'item', { isRead: is_read || isClick })} onClick={onClick}>
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
