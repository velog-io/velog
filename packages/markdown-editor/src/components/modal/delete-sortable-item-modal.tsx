import React from 'react'
import cn from 'clsx'
import { useModal } from '@/contexts/modal'
import { ModalWrapper } from './modal-wrapper'
import { X } from 'lucide-react'

export const DeleteSortableItemModal: React.FC = () => {
  const { onClose, mode, isOpen, setIsConfirm } = useModal()

  const onCloseModal = () => {
    onClose()
  }

  const onConfirm = () => {
    setIsConfirm(true)
  }

  const isVisible = isOpen && mode === 'deleteSortableItem'
  return (
    <ModalWrapper isVisible={isVisible} onOverlayClick={onClose}>
      <div
        className={cn(
          'nx-flex nx-w-[320px]  nx-max-w-sm nx-flex-col nx-rounded-lg nx-bg-white nx-p-6 dark:nx-bg-gray-800',
          'nx-text-gray-900 dark:nx-text-gray-100',
          isVisible ? 'popInFromBottom' : 'popOutToBottom',
        )}
      >
        <div className="nx-mb-4 nx-flex nx-items-center nx-justify-between">
          <h2 className="nx-text-xl nx-font-bold">삭제 확인</h2>
          <button
            onClick={onCloseModal}
            className="nx-text-gray-500 hover:nx-text-gray-700 dark:nx-text-gray-400 dark:hover:nx-text-gray-200"
          >
            <X size={24} />
          </button>
        </div>
        <p className="nx-mb-6 nx-text-gray-600 dark:nx-text-gray-300">
          이 항목을 삭제하시겠습니까?
        </p>
        <div className="nx-flex nx-justify-end nx-space-x-4">
          <button
            onClick={onCloseModal}
            className="nx-rounded nx-bg-gray-200 nx-px-4 nx-py-2 nx-text-gray-600 hover:nx-bg-gray-300 dark:nx-bg-gray-700 dark:nx-text-gray-300 dark:hover:nx-bg-gray-600"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="nx-rounded nx-bg-red-500 nx-px-4 nx-py-2 nx-text-white hover:nx-bg-red-600 dark:nx-bg-red-600 dark:hover:nx-bg-red-700"
          >
            삭제
          </button>
        </div>
      </div>
    </ModalWrapper>
  )
}
