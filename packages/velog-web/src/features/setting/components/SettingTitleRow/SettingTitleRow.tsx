'use client'

import useInput from '@/hooks/useInput'
import styles from './SettingTitleRow.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useEffect, useState } from 'react'
import SettingRow from '../SettingRow'
import SettingInput from '../SettingInput'
import Button from '@/components/Button'
import { useUpdateVelogTitleMutation, useVelogConfigQuery } from '@/graphql/helpers/generated'

const cx = bindClassNames(styles)

type Props = {
  title: string | null
  username: string
}

function SettingTitleRow(props: Props) {
  const { username } = props
  const [edit, setEdit] = useState(false)
  const { input: value, onChange, setInput } = useInput(props.title || `${username}.log`)
  const { mutateAsync: updateVelogTitleMutateAsync } = useUpdateVelogTitleMutation()
  const { data } = useVelogConfigQuery({ input: { username } })

  useEffect(() => {
    if (!data?.velogConfig) return
    setInput(data.velogConfig.title || `${username}.log`)
  }, [data, username, setInput])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateVelogTitleMutateAsync({ input: { title: value } })
    setEdit(false)
  }

  return (
    <div className={cx('block')}>
      <SettingRow
        title="벨로그 제목"
        description="개인 페이지의 좌측 상단에 나타나는 페이지 제목입니다."
        editButton={!edit}
        onClickEdit={() => setEdit(true)}
      >
        {edit ? (
          <form className={cx('form')} onSubmit={onSubmit}>
            <SettingInput value={value} onChange={onChange} placeholder="벨로그 제목" />
            <Button>저장</Button>
          </form>
        ) : (
          <>{value}</>
        )}
      </SettingRow>
    </div>
  )
}

export default SettingTitleRow
