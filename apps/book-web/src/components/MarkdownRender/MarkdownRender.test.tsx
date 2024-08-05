import MarkdownRender from './MarkdownRender'
import { render } from '@testing-library/react'

describe('MarkdownRender', () => {
  it('renders successfully', () => {
    render(<MarkdownRender />)
  })
})
