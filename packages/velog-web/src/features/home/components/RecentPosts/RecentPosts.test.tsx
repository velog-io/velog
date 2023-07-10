import RecentPosts from './RecentPosts'
import { render, screen } from '@testing-library/react'

describe('RecentPosts', () => {
  it('renders successfully', () => {
    render(<RecentPosts />)
  })
})
