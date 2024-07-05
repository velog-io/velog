import { createPortal } from 'react-dom'
import { DeleteSortableItemModal } from '../modal/delete-sortable-item-modal'

export const ModalPotal = () => {
  return createPortal(<DeleteSortableItemModal />, document.body)
}
