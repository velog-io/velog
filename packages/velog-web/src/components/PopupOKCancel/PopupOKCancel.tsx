'use client'

import Button from '../Button'
import PopupBase from '../PopupBase'
import styles from './PopupOKCancel.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  isVisible: boolean
  title?: string
  onConfirm?: () => any
  onCancel?: () => any
  children: React.ReactNode
}

function PopupOKCancel({ isVisible, title, children, onConfirm, onCancel }: Props) {
  return (
    <PopupBase isVisible={isVisible}>
      <div className={cx('block')}>
        {title && <h3>{title}</h3>}
        <div className="message">{children}</div>
        <div className="button-area">
          {onCancel && (
            <Button color="transparent" onClick={onCancel}>
              취소
            </Button>
          )}
          <Button onClick={onConfirm}>확인</Button>
        </div>
      </div>
    </PopupBase>
  )
}

export default PopupOKCancel
