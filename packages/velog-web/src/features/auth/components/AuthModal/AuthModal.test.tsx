import AuthModal from './AuthModal'
import { render, screen } from '@testing-library/react'

describe('AuthModal', () => {
  it('renders successfully', () => {
    render(<AuthModal />)
  })
})
