import { ToolbarCommand } from './type'
import { EditorSelection } from '@codemirror/state'

const italic: ToolbarCommand = {
  name: 'italic',
  keyCommand: 'italic',
  button: { 'aria-label': 'Add italic text' },
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" x2="10" y1="4" y2="4" />
      <line x1="14" x2="5" y1="20" y2="20" />
      <line x1="15" x2="9" y1="4" y2="20" />
    </svg>
  ),
  execute: (view) => {
    if (!view) return
    view.dispatch(
      view.state.changeByRange((range) => ({
        changes: [
          { from: range.from, insert: '*' },
          { from: range.to, insert: '*' },
        ],
        range: EditorSelection.range(range.from + 1, range.to + 1),
      })),
    )
  },
}

export default italic
