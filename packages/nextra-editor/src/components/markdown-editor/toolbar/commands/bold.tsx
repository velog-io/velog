import { TransactionSpec } from '@codemirror/state'
import { ToolbarCommand } from './type'
import { EditorView, KeyBinding } from '@codemirror/view'

// Bold 명령을 위한 keymap 정의
export const boldKeymap: KeyBinding = {
  linux: 'Shift-Ctrl-b',
  win: 'Shift-Ctrl-b',
  mac: 'Shift-Meta-b',
  run: (view) => {
    execute(view)
    return true
  },
  preventDefault: true,
}

// Bold 명령 정의
const bold: ToolbarCommand = {
  name: 'bold',
  keyCommand: 'bold',
  button: { 'aria-label': 'Add bold text' },
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
      <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
    </svg>
  ),
  execute,
  keymap: boldKeymap,
}

function execute(view: EditorView | null) {
  if (!view) return
  const { state, dispatch } = view
  const selection = state.selection
  const selectedText = state.doc.sliceString(selection.main.from, selection.main.to)

  let transaction: TransactionSpec
  if (selectedText.length === 0) {
    transaction = {
      changes: { from: selection.main.from, insert: '**텍스트**' },
      selection: { anchor: selection.main.from, head: selection.main.from + 7 },
    }
  } else {
    const boldRegex = /^\*\*[\s\S]*\*\*$/
    let newText

    if (boldRegex.test(selectedText)) {
      newText = selectedText.replace(/^\*\*|\*\*$/g, '')
    } else {
      newText = `**${selectedText}**`
    }

    transaction = {
      changes: { from: selection.main.from, to: selection.main.to, insert: newText },
      selection: {
        anchor: selection.main.from,
        head: selection.main.from + newText.length,
      },
    }
  }

  dispatch(state.update(transaction))
  view.focus()
}

export default bold
