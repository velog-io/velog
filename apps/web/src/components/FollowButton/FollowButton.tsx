import { useCallback, useEffect, useState } from 'react'
import styles from './FollowButton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import {
  useCurrentUserQuery,
  useFollowMutation,
  useGetUserFollowInfoQuery,
  useUnfollowMutation,
} from '@/graphql/server/generated/server'
import { useAuth } from '@/state/auth'
import { debounce } from 'throttle-debounce'
import { useModal } from '@/state/modal'
const cx = bindClassNames(styles)

type Props = {
  followingUserId: string
  className?: string
  onSuccess?: () => void
}

function FollowButton({ followingUserId, className, onSuccess }: Props) {
  const {
    value: { currentUser },
  } = useAuth()

  const {
    data,
    isRefetching,
    isFetching,
    isLoading: isFollowInfoLoading,
  } = useGetUserFollowInfoQuery(
    { input: { id: followingUserId } },
    { gcTime: 1000 * 60 * 1, staleTime: 1000 },
  )

  const { isLoading: isCurrentUserLoading } = useCurrentUserQuery()

  const { actions } = useModal()

  const { mutate: followMutate } = useFollowMutation()
  const { mutate: unfollowMutate } = useUnfollowMutation()

  const [initialFollowState, setInitialFollowState] = useState<boolean | undefined>()
  const [currentFollowState, setCurrentFollowState] = useState<boolean | undefined>()

  const [followingButtonText, setFollowingButtonText] = useState('팔로잉')

  const onFollowButtonMouseLeave = () => {
    setInitialFollowState(currentFollowState || false)
  }

  const onUnfollowButtonMouseEnter = () => {
    setFollowingButtonText('언팔로우')
  }
  const onUnfollowButtonMouseLeave = () => {
    setFollowingButtonText('팔로잉')
  }

  const initialize = useCallback((value: boolean) => {
    setInitialFollowState(value)
    setCurrentFollowState(value)
  }, [])

  const onClick = debounce(300, async () => {
    try {
      if (!currentUser) {
        actions.showModal('login')
        return
      }

      const input = { followingUserId }
      if (currentFollowState) {
        unfollowMutate(
          { input },
          {
            onSuccess,
          },
        )
      } else {
        setFollowingButtonText('팔로잉')
        followMutate(
          { input },
          {
            onSuccess,
          },
        )
      }

      initialize(!currentFollowState)
    } catch (error) {
      console.log('follow error', error)
      console.log('currentFollowState?', currentFollowState)
    }
  })

  useEffect(() => {
    if (isRefetching) return
    const isFollowed = data?.user?.is_followed
    if (isFollowed === undefined) return
    initialize(isFollowed)
  }, [data, isRefetching, initialize])

  if (isFetching || isFollowInfoLoading || isCurrentUserLoading) {
    return <div className={cx('skeleton', className)} />
  }

  return (
    <div className={cx('block', { hide: followingUserId === currentUser?.id }, className)}>
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
          className={cx('unfollowButton', 'button', {
            isUnfollowText: followingButtonText === '언팔로우',
          })}
          onClick={onClick}
          onMouseEnter={onUnfollowButtonMouseEnter}
          onMouseLeave={onUnfollowButtonMouseLeave}
        >
          <span>{followingButtonText}</span>
        </button>
      )}
    </div>
  )
}

export default FollowButton
