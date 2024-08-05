import MarkdownEditor from './MarkdownEditor'
import { render } from '@testing-library/react'

describe('MarkdownEditor', () => {
  it('renders successfully', () => {
    render(<MarkdownEditor />)
  })
})
