import ConditionalBackground from './ConditionalBackground'
import { render, screen } from '@testing-library/react'

describe('ConditionalBackground', () => {
  it('renders successfully', () => {
    render(<ConditionalBackground>test</ConditionalBackground>)
  })
})
