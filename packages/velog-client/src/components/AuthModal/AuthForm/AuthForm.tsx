import { ModalMode, useModal } from '@/state/modal'
import styles from './AuthForm.module.css'
import useRequest from '@/hooks/useRequest'
import { SendAuthEmailResponse, sendAuthEmail } from '@/lib/api/auth'
import { useCallback } from 'react'

type Props = {
  mode: ModalMode
  loading: boolean
  onToggleMode: () => void
  onSendAuthEmail: (email: string) => void
  registered: boolean | null
  currentPath: string
  isIntegrate?: boolean
  integrateState?: string
}

function AuthForm({}: Props) {
  const {
    actions,
    value: { mode },
  } = useModal()
  const {
    onRequest: _sendAuthEmail,
    loading,
    data,
    onReset: resetSendAuthEmail,
  } = useRequest<SendAuthEmailResponse>(sendAuthEmail)

  const onClose = useCallback(() => {
    actions.closeModal()
    resetSendAuthEmail()
  }, [actions, resetSendAuthEmail])

  const onToggleMode = useCallback(() => {
    const nextMode = mode === 'register' ? 'login' : 'register'
    actions.changeMode(nextMode)
  }, [actions, mode])

  const registered = data && data.registered

  return <div className={styles.block}></div>
}

export default AuthForm
