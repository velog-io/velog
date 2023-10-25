'use client'

import { UndrawBugFixing } from '@/assets/vectors/components'
import ErrorScreenTemplate from '../ErrorScreenTemplate'
import { useRouter } from 'next/navigation'

type Props = {}

function CrashErrorScreen({}: Props) {
  const router = useRouter()
  return (
    <ErrorScreenTemplate
      Illustration={UndrawBugFixing}
      message="엇! 오류가 발생했습니다."
      buttonText="홈으로"
      onButtonClick={() => {
        router.push('/')
      }}
    />
  )
}

export default CrashErrorScreen
