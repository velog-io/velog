'use client'

import { useEffect, useState } from 'react'
import SettingRow from '../SettingRow'
import Button from '@/components/Button'
import PopupOKCancel from '@/components/PopupOKCancel'
import { useUnregisterMutation, useUnregisterTokenQuery } from '@/graphql/helpers/generated'
import { toast } from 'react-toastify'

type Props = {}

function SettingUnregisterRow({}: Props) {
  const [ask, setAsk] = useState(false)
  const [isQueryEnable, setIsQueryEnable] = useState(false)
  const { data: unregisterTokenData } = useUnregisterTokenQuery(undefined, {
    enabled: isQueryEnable,
  })
  const { mutateAsync } = useUnregisterMutation()

  useEffect(() => {
    if (!ask) return
    setIsQueryEnable(true)
  }, [ask])

  const onUnregister = async () => {
    const token = unregisterTokenData?.unregisterToken

    if (!token) {
      toast.error('회원 탈퇴 중 오류가 발생하였습니다.\n잠시후 다시 실행해주세요.')
      return
    }

    console.log('token', token)

    await mutateAsync({
      input: { token },
    })

    localStorage.clear()
    window.location.href = '/'
  }

  return (
    <>
      <SettingRow
        title="회원 탈퇴"
        description="탈퇴 시 작성하신 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다."
      >
        <Button color="red" onClick={() => setAsk(true)}>
          회원 탈퇴
        </Button>
      </SettingRow>
      <PopupOKCancel
        title="회원 탈퇴"
        isVisible={ask}
        onCancel={() => setAsk(false)}
        onConfirm={onUnregister}
      >
        정말로 탈퇴 하시겠습니까?
      </PopupOKCancel>
    </>
  )
}

export default SettingUnregisterRow
