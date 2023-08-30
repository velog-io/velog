import Modal from './Modal'
import { render } from '@testing-library/react'

describe('Modal', () => {
  it('renders successfully', () => {
    render(
      <Modal isVisible={true} onOverlayClick={() => {}}>
        test
      </Modal>,
    )
  })
})
