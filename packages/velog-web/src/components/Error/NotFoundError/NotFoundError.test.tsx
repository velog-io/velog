import NotFoundError from './NotFoundError'
import { render } from '@testing-library/react'

describe('NotFoundError', () => {
  it('renders successfully', () => {
    render(<NotFoundError />)
  })
})
