import RoundButton from './RoundButton'
import { render, screen } from '@testing-library/react'

describe('RoundButton', () => {
  it('renders successfully', () => {
    render(<RoundButton color="darkGray" />)
  })
})
