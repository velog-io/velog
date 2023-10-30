import UserProfile from './UserProfile'
import { render } from '@testing-library/react'

describe('UserProfile', () => {
  it('renders successfully', () => {
    render(<UserProfile />)
  })
})
