import { useCallback, useEffect, useState } from 'react'
import styles from './FollowButton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import {
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
  className?: string
  resetFollowCount?: (param: 'follow' | 'unfollow') => void
}

function FollowButton({ username, followingUserId, className, resetFollowCount }: Props) {
  const params = useParams()
  const {
    value: { currentUser },
  } = useAuth()

  const {
    data,
    isRefetching,
    isLoading: isFollowInfoLoading,
  } = useGetUserFollowInfoQuery(
    { input: { username: username } },
    { gcTime: 1000 * 60 * 1, staleTime: 1000 },
  )

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

  const queryClient = useQueryClient()

  const onSuccess = () => {
    const targetUsername = getUsernameFromParams(params)
    console.log('targetUsername', targetUsername)
    queryClient.refetchQueries({
      queryKey: useGetUserFollowInfoQuery.getKey({ input: { username: targetUsername } }),
    })
  }

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
      if (resetFollowCount) {
        resetFollowCount(currentFollowState ? 'unfollow' : 'follow')
      }
    } catch (error) {
      console.log(error)
    }
  })

  useEffect(() => {
    if (isRefetching) return
    const isFollowed = data?.user?.is_followed
    if (isFollowed === undefined) return
    initialize(isFollowed)
  }, [data, isRefetching, initialize])

  if (isFollowInfoLoading) return <div className={cx('skeleton', className)} />

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
