import RoundButton from '@/components/RoundButton'
import styles from './ErrorScreenTemplate.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { SVGProps } from 'react'

const cx = bindClassNames(styles)

type Props = {
  Illustration: (props: SVGProps<SVGSVGElement>) => React.JSX.Element
  message: string
  buttonText?: string
  onButtonClick?: () => void
}

function ErrorScreenTemplate({ Illustration, message, buttonText, onButtonClick }: Props) {
  return (
    <div className={cx('block')}>
      <Illustration width={320} />
      <div className={cx('message')}>{message}</div>
      {buttonText && (
        <div className={cx('button-wrapper')}>
          <RoundButton size="large" onClick={onButtonClick}>
            {buttonText}
          </RoundButton>
        </div>
      )}
    </div>
  )
}

export default ErrorScreenTemplate
