import Sidebar from './Sidebar'
import { render } from '@testing-library/react'

describe('Sidebar', () => {
  it('renders successfully', () => {
    render(<Sidebar />)
  })
})
