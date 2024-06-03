import { EditorSelection } from '@codemirror/state'
import { ToolbarCommand } from './type'

const image: ToolbarCommand = {
  name: 'image',
  keyCommand: 'image',
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  ),
  execute: ({ state, view }) => {
    if (!view || !state) return
    const main = view.state.selection.main
    const text = view.state.sliceDoc(view.state.selection.main.from, view.state.selection.main.to)
    view.dispatch({
      changes: {
        from: main.from,
        to: main.to,
        insert: `![](${text})`,
      },
      selection: EditorSelection.range(main.from + 4, main.to + 4),
    })
  },
}

export default image
