import { useEffect, useState } from 'react'
import styles from './FollowButton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import {
  useCurrentUserQuery,
  useFollowMutation,
  useGetUserFollowInfoQuery,
  useUnfollowMutation,
} from '@/graphql/generated'
import { useAuth } from '@/state/auth'
import { debounce } from 'throttle-debounce'
import { useModal } from '@/state/modal'

const cx = bindClassNames(styles)

type Props = {
  followingUserId: string
  onSuccess?: (param?: any) => void
}

function FollowButton({ followingUserId, onSuccess }: Props) {
  const {
    value: { currentUser },
  } = useAuth()

  const { data, refetch } = useGetUserFollowInfoQuery({ input: { id: followingUserId } })
  const { isLoading } = useCurrentUserQuery()
  const { actions } = useModal()
  const { mutate: followMutate } = useFollowMutation()
  const { mutate: unfollowMutate } = useUnfollowMutation()

  const [initialFollowState, setInitialFollowState] = useState<boolean | null>(null)
  const [currentFollowState, setCurrentFollowState] = useState<boolean | null>(null)

  const [buttonText, setButtonText] = useState('팔로잉')

  useEffect(() => {
    setInitialFollowState(data?.user?.is_following || false)
    setCurrentFollowState(data?.user?.is_following || false)
  }, [data])

  const onFollowButtonMouseLeave = () => {
    setInitialFollowState(currentFollowState)
  }

  const onUnfollowButtonMouseEnter = () => {
    setButtonText('언팔로우')
  }
  const onUnfollowButtonMouseLeave = () => {
    setButtonText('팔로잉')
  }

  const onClick = debounce(300, async () => {
    try {
      if (!currentUser) {
        actions.showModal('login')
        return
      }

      const input = { followingUserId }
      if (currentFollowState) {
        unfollowMutate({ input })
      } else {
        followMutate({ input })
        setButtonText('팔로잉')
      }

      setInitialFollowState(!currentFollowState)
      setCurrentFollowState(!currentFollowState)
      refetch()

      if (onSuccess) {
        onSuccess(currentFollowState ? 'unfollow' : 'follow')
      }
    } catch (error) {
      console.log(error)
    }
  })

  if (isLoading) return <div className={cx('skeleton')} />

  return (
    <div className={cx('block')}>
      {!initialFollowState ? (
        <button
          className={cx('followButton', 'button', { isFollowing: !!currentFollowState })}
          onClick={onClick}
          onMouseLeave={onFollowButtonMouseLeave}
        >
          <span>{!currentFollowState ? '팔로우' : '팔로잉'}</span>
        </button>
      ) : (
        <button
          className={cx('unfollowButton', 'button', { isUnfollow: buttonText === '언팔로우' })}
          onClick={onClick}
          onMouseEnter={onUnfollowButtonMouseEnter}
          onMouseLeave={onUnfollowButtonMouseLeave}
        >
          <span>{buttonText}</span>
        </button>
      )}
    </div>
  )
}

export default FollowButton
