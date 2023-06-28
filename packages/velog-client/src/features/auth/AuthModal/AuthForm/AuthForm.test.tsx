import AuthForm from './AuthForm'
import { render, screen } from '@testing-library/react'

describe('AuthForm', () => {
  it('renders successfully', () => {
    render(<AuthForm />)
  })
})
