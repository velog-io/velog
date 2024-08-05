'use client'

import Button from '../Button'
import PopupBase from '../PopupBase'
import SpinnerBlock from '../SpinnerBlock'
import styles from './PopupOKCancel.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  isVisible: boolean
  title?: string
  onConfirm?: () => any
  onCancel?: () => any
  children: React.ReactNode
  isLoading?: boolean
}

function PopupOKCancel({
  isVisible,
  title,
  children,
  onConfirm,
  onCancel,
  isLoading = false,
}: Props) {
  return (
    <PopupBase isVisible={isVisible}>
      {isLoading ? (
        <div className={cx('loading')}>
          <SpinnerBlock />
        </div>
      ) : (
        <div className={cx('block')}>
          {title && <h3>{title}</h3>}
          <div className={cx('message')}>{children}</div>
          <div className={cx('buttonArea')}>
            {onCancel && (
              <Button color="transparent" onClick={onCancel}>
                취소
              </Button>
            )}
            <Button onClick={onConfirm}>확인</Button>
          </div>
        </div>
      )}
    </PopupBase>
  )
}

export default PopupOKCancel
