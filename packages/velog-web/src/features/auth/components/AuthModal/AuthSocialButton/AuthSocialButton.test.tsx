import AuthSocialButton from './AuthSocialButton'
import { render } from '@testing-library/react'

describe('AuthSocialButton', () => {
  it('renders successfully', () => {
    render(<AuthSocialButton provider="google" tabIndex={4} />)
  })
})
