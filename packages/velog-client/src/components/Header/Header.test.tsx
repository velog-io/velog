import Header from './Header'
import { render, screen } from '@testing-library/react'

describe('Header', () => {
  it('renders successfully', () => {
    render(<Header />)
  })
})
