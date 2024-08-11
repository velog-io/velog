'use client'

import { UndrawPageNotFound } from '@/assets/vectors/components'
import ErrorScreenTemplate from '../ErrorScreenTemplate'
import { useRouter } from 'next/navigation'

type Props = {}

function NotFoundError({}: Props) {
  const router = useRouter()
  return (
    <ErrorScreenTemplate
      Illustration={UndrawPageNotFound}
      message="아무것도 없네요!"
      buttonText="홈으로"
      onButtonClick={() => {
        router.push('/')
      }}
    />
  )
}

export default NotFoundError
