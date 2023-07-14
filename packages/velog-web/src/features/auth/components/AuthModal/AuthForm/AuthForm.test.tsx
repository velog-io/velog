import AuthForm from './AuthForm'
import { render } from '@testing-library/react'

describe('AuthForm', () => {
  it('renders successfully', () => {
    render(<AuthForm />)
  })
})
