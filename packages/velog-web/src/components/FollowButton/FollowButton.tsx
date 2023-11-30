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
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { getUsernameFromParams } from '@/lib/utils'

const cx = bindClassNames(styles)

type Props = {
  username: string
  followingUserId: string
  onSuccess?: (param?: any) => void | Promise<void>
  isFollowed: boolean | undefined
  className?: string
}

function FollowButton({
  username: itemUsername,
  followingUserId,
  isFollowed,
  onSuccess,
  className,
}: Props) {
  const params = useParams()
  const username = getUsernameFromParams(params)
  const {
    value: { currentUser },
  } = useAuth()

  const {
    data,
    isRefetching,
    isLoading: isFollowInfoLoading,
  } = useGetUserFollowInfoQuery(
    { input: { username: itemUsername } },
    { retryDelay: 400, cacheTime: 1000 * 60 * 1, staleTime: 1000 },
  )
  const { isLoading: isCurrentUserLoading } = useCurrentUserQuery()
  const { actions } = useModal()

  const { mutate: followMutate } = useFollowMutation()
  const { mutate: unfollowMutate } = useUnfollowMutation()

  const [initialFollowState, setInitialFollowState] = useState<boolean>()
  const [currentFollowState, setCurrentFollowState] = useState<boolean>()

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

  const queryClient = useQueryClient()
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
            onSuccess: () => {
              console.log('hello')
              queryClient.refetchQueries({
                queryKey: ['getUserFollowInfo', { input: { username } }],
              })
            },
          },
        )
      } else {
        followMutate(
          { input },
          {
            onSuccess: () => {
              queryClient.refetchQueries({
                queryKey: ['getUserFollowInfo', { input: { username } }],
              })
            },
          },
        )
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
    if (isFollowed === undefined) return
    setInitialFollowState(isFollowed)
    setCurrentFollowState(isFollowed)
  }, [isFollowed])

  useEffect(() => {
    if (isRefetching) return
    const result = data?.user?.is_followed
    if (result === undefined) return
    setCurrentFollowState(result)
  }, [data, isRefetching])

  if (isFollowed === undefined || isFollowInfoLoading || isCurrentUserLoading)
    return <div className={cx('skeleton', className)} />

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
