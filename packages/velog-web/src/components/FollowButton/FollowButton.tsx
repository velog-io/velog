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
  onSuccess?: (param?: any) => void | Promise<void>
  isFollowed: boolean
  className?: string
}

function FollowButton({ followingUserId, isFollowed, onSuccess, className }: Props) {
  const {
    value: { currentUser },
  } = useAuth()

  const { data, isRefetching } = useGetUserFollowInfoQuery(
    { input: { id: followingUserId } },
    { staleTime: 10 },
  )
  const { isLoading } = useCurrentUserQuery()
  const { actions } = useModal()
  const { mutateAsync: followMutate } = useFollowMutation()
  const { mutateAsync: unfollowMutate } = useUnfollowMutation()

  const [initialFollowState, setInitialFollowState] = useState<boolean>(isFollowed)
  const [currentFollowState, setCurrentFollowState] = useState<boolean>(isFollowed)

  const [buttonText, setButtonText] = useState('팔로잉')

  const onFollowButtonMouseLeave = () => {
    setInitialFollowState(currentFollowState || false)
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
        await unfollowMutate({ input })
      } else {
        await followMutate({ input })
        setButtonText('팔로잉')
      }

      setInitialFollowState(!currentFollowState)
      setCurrentFollowState(!currentFollowState)

      if (onSuccess) {
        await onSuccess(currentFollowState ? 'unfollow' : 'follow')
      }
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (isRefetching) return
    setCurrentFollowState(data?.user?.is_followed || isFollowed)
  }, [data, isFollowed, isRefetching])

  if (isLoading) return <div className={cx('skeleton')} />

  return (
    <div className={cx('block', className)}>
      {!initialFollowState ? (
        <button
          className={cx('followButton', 'button', { isFollowed: currentFollowState })}
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
