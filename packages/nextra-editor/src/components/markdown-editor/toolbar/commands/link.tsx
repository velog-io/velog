import { EditorSelection } from '@codemirror/state'
import { ToolbarCommand } from './type'

const link: ToolbarCommand = {
  name: 'link',
  keyCommand: 'link',
  button: { 'aria-label': 'Add link' },
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
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  execute: (view) => {
    if (!view) return
    const main = view.state.selection.main
    const text = view.state.sliceDoc(view.state.selection.main.from, view.state.selection.main.to)
    view.dispatch({
      changes: {
        from: main.from,
        to: main.to,
        insert: `[${text}](){:target="_blank"}`,
      },
      selection: EditorSelection.range(main.from + 3 + text.length, main.to + 3),
    })
  },
}

export default link
