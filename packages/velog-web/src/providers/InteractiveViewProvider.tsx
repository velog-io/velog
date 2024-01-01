'use client'

import AuthModal from '@/features/auth/components/AuthModal/AuthModal'
import { ToastContainer, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type Props = {
  children: React.ReactNode
}

function InteractiveViewProvider({ children }: Props) {
  return (
    <>
      {children}
      <AuthModal />
      <ToastContainer
        transition={Flip}
        position="top-right"
        autoClose={2000}
        closeOnClick={true}
        pauseOnHover={true}
      />
    </>
  )
}

export default InteractiveViewProvider
