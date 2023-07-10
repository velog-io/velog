import TrendingPosts from './TrendingPosts'
import { render, screen } from '@testing-library/react'

describe('TrendingPosts', () => {
  it('renders successfully', () => {
    render(<TrendingPosts />)
  })
})
