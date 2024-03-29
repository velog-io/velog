'use client'

import SpinnerBlock from '@/components/SpinnerBlock'
import { useConfirmChangeEmailMutation } from '@/graphql/helpers/generated'
import { usePopup } from '@/state/popup'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'

type Props = {
  searchParams: { code?: string }
}

export default function Page({ searchParams }: Props) {
  const code = searchParams.code
  const { mutateAsync } = useConfirmChangeEmailMutation()
  const router = useRouter()
  const { actions } = usePopup()
  const hasChecked = useRef<boolean>(false)

  const proceesChangeEmail = useCallback(
    async (code: string) => {
      try {
        await mutateAsync({
          input: {
            code,
          },
        })

        actions.open({
          title: '성공',
          message: '이메일 변경이 완료 되었습니다.',
        })
        router.push('/setting')
      } catch (error: any) {
        if (error?.status === 404) {
          toast.error('이메일 변경 code가 존재하지 않습니다.')
        } else {
          toast.error('잘못된 접근 입니다.')
        }

        router.push('/')
      }
    },
    [actions, mutateAsync, router],
  )

  useEffect(() => {
    if (hasChecked.current) return
    hasChecked.current = true

    if (!code) {
      console.log('not found change email code')
      toast.error('잘못된 접근 입니다.')
      router.push('/')
      return
    }

    proceesChangeEmail(code)
  }, [code, proceesChangeEmail, router])

  return <SpinnerBlock />
}
