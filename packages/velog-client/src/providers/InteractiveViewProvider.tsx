'use client'

type Props = {
  children: React.ReactNode
}

function InteractiveViewProvider({ children }: Props) {
  return (
    <>
      {children}
      <div id="modal-root" />
    </>
  )
}

export default InteractiveViewProvider
