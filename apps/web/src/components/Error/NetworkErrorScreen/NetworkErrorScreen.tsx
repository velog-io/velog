import { UndrawServerDown } from '@/assets/vectors/components'
import ErrorScreenTemplate from '../ErrorScreenTemplate'

type Props = {}

function NetworkErrorScreen({}: Props) {
  return (
    <ErrorScreenTemplate
      Illustration={UndrawServerDown}
      message={'서버와의 연결이 불안정합니다.\n잠시 후 시도해주세요.'}
      buttonText="새로고침"
      onButtonClick={() => window.location.reload()}
    />
  )
}

export default NetworkErrorScreen
