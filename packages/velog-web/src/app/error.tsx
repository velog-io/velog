'use client'

import * as Sentry from '@sentry/browser'
import { useNetworkState } from 'react-use'
import apiClient from '@/lib/api/apiClient'
import { useEffect, useState } from 'react'
import ErrorScreenTemplate from '@/components/Error/ErrorScreenTemplate'
import { UndrawBugFixing, UndrawServerDown, UndrawUpdate } from '@/assets/vectors/components'
import { ENV } from '@/env'

async function checkNetwork() {
  try {
    await apiClient.get('/api/check', { timeout: 5000 })
    return true
  } catch (_) {
    return false
  }
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.log('hello error')
  const [networkStatus, setNetworkStatus] = useState<'offline' | 'online' | null>(null)

  const network = useNetworkState()
  useEffect(() => {
    if (network && network.online !== undefined) {
      setNetworkStatus(network.online ? 'online' : 'offline')
    }
  }, [network])

  useEffect(() => {
    if (ENV.dockerEnv === 'production') {
      Sentry.captureException(error)
    }
  }, [error])

  useEffect(() => {
    const fn = async () => {
      const online = await checkNetwork()
      setNetworkStatus(online ? 'online' : 'offline')
    }
    fn()
  }, [network.online])

  if (networkStatus !== null) {
    if (networkStatus === 'online') {
      return (
        <ErrorScreenTemplate
          Illustration={UndrawUpdate}
          message={'벨로그가 업데이트 되었습니다. \n새로고침 후 다시 시도해주세요.'}
          onButtonClick={() => reset()}
          buttonText="새로고침"
        />
      )
    }
    if (networkStatus === 'offline') {
      return (
        <ErrorScreenTemplate
          Illustration={UndrawServerDown}
          message={'서버와의 연결이 불안정합니다.\n잠시 후 시도해주세요.'}
          onButtonClick={() => reset()}
          buttonText="새로고침"
        />
      )
    }
    return null
  }

  if (error) {
    return (
      <ErrorScreenTemplate
        Illustration={UndrawBugFixing}
        message="엇! 오류가 발생했습니다."
        buttonText="홈으로"
        onButtonClick={() => {
          window.location.href = '/'
        }}
      />
    )
  }

  return null
}
