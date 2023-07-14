import MyComponent from './MyComponent'
import { render } from '@testing-library/react'

describe('MyComponent', () => {
  it('renders successfully', () => {
    render(<MyComponent />)
  })
})
