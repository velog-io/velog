import { EditorSelection } from '@codemirror/state'
import { ToolbarCommand } from './type'

const strike: ToolbarCommand = {
  name: 'strike',
  keyCommand: 'strike',
  button: { 'aria-label': 'Add strike text' },
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
      <path d="M16 4H9a3 3 0 0 0-2.83 4" />
      <path d="M14 12a4 4 0 0 1 0 8H6" />
      <line x1="4" x2="20" y1="12" y2="12" />
    </svg>
  ),
  execute: ({ state, view }) => {
    if (!view || !state) return
    view.dispatch(
      view.state.changeByRange((range) => ({
        changes: [
          { from: range.from, insert: '~~' },
          { from: range.to, insert: '~~' },
        ],
        range: EditorSelection.range(range.from + 2, range.to + 2),
      })),
    )
  },
}

export default strike
