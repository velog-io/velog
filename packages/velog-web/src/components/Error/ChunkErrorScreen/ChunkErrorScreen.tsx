'use client'

import apiClient from '@/lib/api/apiClient'
import styles from './ChunkErrorScreen.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useEffect, useState } from 'react'
import { useNetworkState } from 'react-use'
import ErrorScreenTemplate from '../ErrorScreenTemplate'
import { UndrawUpdate } from '@/assets/vectors/components'
import NetworkErrorScreen from '../NetworkErrorScreen'

const cx = bindClassNames(styles)

type Props = {}

async function checkNetwork() {
  try {
    await apiClient.get('/api/check', { timeout: 5000 })
    return true
  } catch (_) {
    return false
  }
}

function ChunkErrorScreen({}: Props) {
  const [networkStatus, setNetworkStatus] = useState<'offline' | 'online' | null>(null)

  const network = useNetworkState()

  useEffect(() => {
    if (network && network.online !== undefined) {
      setNetworkStatus(network.online ? 'online' : 'offline')
    }
  }, [network])

  useEffect(() => {
    const fn = async () => {
      const online = await checkNetwork()
      setNetworkStatus(online ? 'online' : 'offline')
    }
    fn()
  }, [network.online])

  if (networkStatus === null) return null
  // if (networkStatus === 'online') {
  //   return (
  //     <ErrorScreenTemplate
  //       Illustration={UndrawUpdate}
  //       message={'벨로그가 업데이트 되었습니다. \n새로고침 후 다시 시도해주세요.'}
  //       onButtonClick={() => window.location.reload()}
  //       buttonText="새로고침"
  //     />
  //   )
  // }

  return <NetworkErrorScreen />
}

export default ChunkErrorScreen
