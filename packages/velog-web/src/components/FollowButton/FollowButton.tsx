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
  isFollowed: boolean | undefined
  className?: string
}

function FollowButton({ followingUserId, isFollowed, onSuccess, className }: Props) {
  const {
    value: { currentUser },
  } = useAuth()

  const {
    data,
    isRefetching,
    isLoading: isFollowInfoLoading,
  } = useGetUserFollowInfoQuery({ input: { id: followingUserId } })
  const { isLoading: isCurrentUserLoading } = useCurrentUserQuery()
  const { actions } = useModal()
  const { mutateAsync: followMutate } = useFollowMutation()
  const { mutateAsync: unfollowMutate } = useUnfollowMutation()

  const [initialFollowState, setInitialFollowState] = useState<boolean | undefined>(isFollowed)
  const [currentFollowState, setCurrentFollowState] = useState<boolean | undefined>(isFollowed)

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
    if (isFollowed !== undefined) {
      setInitialFollowState(isFollowed)
      setCurrentFollowState(isFollowed)
    }
  }, [isFollowed])

  useEffect(() => {
    if (isRefetching) return
    setCurrentFollowState(!!data?.user?.is_followed || isFollowed)
  }, [data, isFollowed, isRefetching])

  if (isFollowed === undefined || isFollowInfoLoading || isCurrentUserLoading)
    return <div className={cx('skeleton')} />

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
