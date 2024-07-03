import React from 'react'
import ModalWrapper from './modal-wrapper'
import { useModal } from '../../contexts/modal'

const ItemDelete: React.FC = () => {
  const { modalType, isModalOpen, setIsModalOpen } = useModal()

  const handleDeleteClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleConfirmDelete = () => {
    // 여기서 삭제 로직을 추가하세요
    console.log('Item deleted')
    setIsModalOpen(false)
  }

  if (modalType !== 'deleteItem') return null
  return (
    <div>
      <button className="nx-btn nx-btn-danger" onClick={handleDeleteClick}>
        삭제
      </button>

      <ModalWrapper isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="nx-mb-4">정말 삭제하시겠습니까?</h2>
        <div className="nx-flex nx-justify-end nx-gap-4">
          <button className="nx-btn nx-btn-primary" onClick={handleConfirmDelete}>
            확인
          </button>
          <button className="nx-btn nx-btn-secondary" onClick={handleCloseModal}>
            취소
          </button>
        </div>
      </ModalWrapper>
    </div>
  )
}

export default ItemDelete
