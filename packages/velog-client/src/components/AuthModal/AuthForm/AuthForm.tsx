import { ModalMode } from '@/state/modal'
import styles from './AuthForm.module.css'

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
  return <div className={styles.block}></div>
}

export default AuthForm
