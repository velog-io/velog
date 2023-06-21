import MyComponent from './MyComponent'
import { render, screen } from '@testing-library/react'

describe('MyComponent', () => {
  it('renders successfully', () => {
    render(<MyComponent />)
  })
})
