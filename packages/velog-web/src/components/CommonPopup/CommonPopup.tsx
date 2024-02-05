'use client'

import { usePopup } from '@/state/popup'
import PopupOKCancel from '../PopupOKCancel'

type Props = {}

function CommonPopup({}: Props) {
  const { value, actions } = usePopup()
  const onConfirm = () => {
    actions.close()
  }
  return (
    <PopupOKCancel isVisible={value.isVisible} title={value.title} onConfirm={onConfirm}>
      {value.message}
    </PopupOKCancel>
  )
}

export default CommonPopup
