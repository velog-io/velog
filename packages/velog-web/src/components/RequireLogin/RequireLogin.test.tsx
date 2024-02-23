import RequireLogin from './RequireLogin'
import { render } from '@testing-library/react'

describe('RequireLogin', () => {
  it('renders successfully', () => {
    render(<RequireLogin />)
  })
})
