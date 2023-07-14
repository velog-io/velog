import TrendingPosts from './TrendingPosts'
import { render } from '@testing-library/react'

describe('TrendingPosts', () => {
  it('renders successfully', () => {
    render(<TrendingPosts />)
  })
})
