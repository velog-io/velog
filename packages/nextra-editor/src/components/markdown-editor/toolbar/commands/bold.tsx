import { EditorSelection } from '@codemirror/state'
import { ToolbarCommand } from './type'

const bold: ToolbarCommand = {
  name: 'bold',
  button: { 'aria-label': 'Add bold text' },
  icon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
    </svg>
  ),
  execute: ({ state, view }) => {
    if (!view || !state) return
    view.dispatch(
      view.state.changeByRange((range) => ({
        changes: [
          { from: range.from, insert: '**' },
          { from: range.to, insert: '**' },
        ],
        range: EditorSelection.range(range.from + 2, range.to + 2),
      })),
    )
  },
}

export default bold
