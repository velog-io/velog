import HeaderSearchButton from './HeaderSearchButton'
import { render } from '@testing-library/react'

describe('HeaderSearchButton', () => {
  it('renders successfully', () => {
    render(<HeaderSearchButton to="/search" />)
  })
})
