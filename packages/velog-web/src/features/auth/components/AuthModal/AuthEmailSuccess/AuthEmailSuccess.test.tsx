import AuthEmailSuccess from './AuthEmailSuccess'
import { render, screen } from '@testing-library/react'

describe('AuthEmailSuccess', () => {
  it('renders successfully', () => {
    render(<AuthEmailSuccess registered={true} />)
  })
})
