import { EditorSelection } from '@codemirror/state'
import { ToolbarCommand } from './type'

const code: ToolbarCommand = {
  name: 'code',
  keyCommand: 'code',
  button: { 'aria-label': 'Add code block' },
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
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  execute: ({ state, view }) => {
    if (!view || !state) return
    const line = view.state.doc.lineAt(view.state.selection.main.from)
    let insert = '```\n'
    if (line.text.length === 0) {
      insert = insert.concat('코드를 입력하세요')
    }
    view.dispatch(
      view.state.changeByRange((range) => ({
        changes: [
          { from: range.from, insert },
          { from: range.to, insert: '\n```' },
        ],
        range: EditorSelection.range(range.from + 3, range.to + 3),
      })),
    )
  },
}

export default code
