import AuthEmailForm from './AuthEmailForm'
import { render, screen } from '@testing-library/react'

describe('AuthEmailForm', () => {
  it('renders successfully', () => {
    render(<AuthEmailForm />)
  })
})
