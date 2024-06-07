import { EditorView } from 'codemirror'
import { ToolbarCommand } from './type'
import { TransactionSpec } from '@codemirror/state'
import { KeyBinding } from '@codemirror/view'

export const italicKeymap: KeyBinding = {
  linux: 'Shift-Ctrl-i',
  win: 'Shift-Ctrl-i',
  mac: 'Shift-Meta-i',
  run: (view) => {
    execute(view)
    return true
  },
  preventDefault: true,
}

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
  execute,
}

function execute(view: EditorView | null) {
  if (!view) return
  const { state, dispatch } = view
  const selection = state.selection
  const selectedText = state.doc.sliceString(selection.main.from, selection.main.to)

  let transaction: TransactionSpec

  if (selectedText.length === 0) {
    transaction = {
      changes: { from: selection.main.from, insert: '*텍스트*' },
      selection: { anchor: selection.main.from, head: selection.main.from + 5 },
    }
  } else {
    const italicPattern = /^\*[\s\S]*\*$/
    let newText

    if (italicPattern.test(selectedText)) {
      newText = selectedText.replace(/^\*|\*$/g, '')
    } else {
      newText = `*${selectedText}*`
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

export default italic
