import PostCard from './PostCard'
import { render, screen } from '@testing-library/react'

describe('PostCard', () => {
  it('renders successfully', () => {
    render(<PostCard />)
  })
})
