import UserMenu from './UserMenu'
import { render, screen } from '@testing-library/react'

describe('UserMenu', () => {
  it('renders successfully', () => {
    render(<UserMenu />)
  })
})
