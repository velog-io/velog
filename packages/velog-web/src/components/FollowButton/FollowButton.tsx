import { useState } from 'react'
import styles from './FollowButton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useCurrentUserQuery, useFollowMutation, useUnfollowMutation } from '@/graphql/generated'
import { useAuth } from '@/state/auth'
import { debounce } from 'throttle-debounce'
import { useModal } from '@/state/modal'

const cx = bindClassNames(styles)

type Props = {
  followingUserId: string
  isFollowing: boolean
  onSuccess?: (param?: any) => void
}

function FollowButton({ isFollowing, followingUserId, onSuccess }: Props) {
  const {
    value: { currentUser },
  } = useAuth()

  const { isLoading } = useCurrentUserQuery()
  const { actions } = useModal()
  const { mutate: followMutate } = useFollowMutation()
  const { mutate: unfollowMutate } = useUnfollowMutation()

  const [initialFollowState, setInitialFollowState] = useState<boolean>(isFollowing)
  const [currentFollowState, setCurrentFollowState] = useState<boolean>(isFollowing)

  const [buttonText, setButtonText] = useState('팔로잉')

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

      setCurrentFollowState(!currentFollowState)
      setInitialFollowState(!currentFollowState)

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
          className={cx('followButton', 'button', { isFollowing: currentFollowState })}
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
