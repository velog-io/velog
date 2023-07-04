import Skeleton from './Skeleton'
import { render, screen } from '@testing-library/react'

describe('Skeleton', () => {
  it('renders successfully', () => {
    render(<Skeleton />)
  })
})
