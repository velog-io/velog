import BasicLayout from './BasicLayout'
import { render, screen } from '@testing-library/react'

describe('BasicLayout', () => {
  it('renders successfully', () => {
    render(<BasicLayout />)
  })
})
