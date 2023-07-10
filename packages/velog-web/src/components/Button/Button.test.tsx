import Button from './Button'
import { render, screen } from '@testing-library/react'

describe('Button', () => {
  it('renders successfully', () => {
    render(<Button color="darkGray" />)
  })
})
