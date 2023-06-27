'use client'

import AuthModal from '@/components/AuthModal/AuthModal'

type Props = {
  children: React.ReactNode
}

function InteractiveViewProvider({ children }: Props) {
  return (
    <>
      {children}
      <div id="modal-root" />
      <AuthModal />
    </>
  )
}

export default InteractiveViewProvider
