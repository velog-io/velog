import ErrorBoundary from './ErrorBoundary'
import { render } from '@testing-library/react'

describe('ErrorBoundary', () => {
  it('renders successfully', () => {
    render(<ErrorBoundary />)
  })
})
