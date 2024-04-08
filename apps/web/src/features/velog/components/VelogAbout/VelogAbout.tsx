'use client'

import {
  useCurrentUserQuery,
  useGetUserAboutQuery,
  useUpdateAboutMutation,
} from '@/graphql/server/generated/server'
import styles from './VelogAbout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { VelogAboutContent, VelogAboutContentSkeleton } from '../VelogAboutContent'
import useToggle from '@/hooks/useToggle'
import VelogAboutButton from '../VelogAboutButton'
import { useState } from 'react'
import VelogAboutEdit from '../VelogAboutEdit'

const cx = bindClassNames(styles)

type Props = {
  username: string
}

function VelogAbout({ username }: Props) {
  const {
    data: getUserAboutData,
    refetch,
    isLoading,
  } = useGetUserAboutQuery({ input: { username } })
  const { data: currentUserData } = useCurrentUserQuery()
  const { mutateAsync } = useUpdateAboutMutation()

  const isOwn = currentUserData?.currentUser?.username === username || false
  const [about, aboutInput] = useState('')

  const [isEdit, onToggleEdit] = useToggle(false)

  const onClickUpdate = async () => {
    if (isEdit) {
      await mutateAsync({ input: { about } })
      refetch()
    }
    onToggleEdit()
  }

  if (isLoading) return <VelogAboutContentSkeleton />

  return (
    <div className={cx('block')}>
      {isOwn && (getUserAboutData?.user?.profile.about || isEdit) && (
        <VelogAboutButton isEdit={isEdit} onClick={onClickUpdate} />
      )}
      {isEdit ? (
        <VelogAboutEdit
          onChangeMarkdown={aboutInput}
          initialMarkdown={getUserAboutData?.user?.profile.about || ''}
        />
      ) : (
        <VelogAboutContent
          markdown={getUserAboutData?.user?.profile.about || ''}
          isOwn={isOwn}
          onClickWrite={onToggleEdit}
        />
      )}
    </div>
  )
}

export default VelogAbout
