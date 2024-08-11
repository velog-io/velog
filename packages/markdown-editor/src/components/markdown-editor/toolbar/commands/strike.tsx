import { TransactionSpec } from '@codemirror/state'
import { ToolbarCommand } from './type'
import { EditorView } from 'codemirror'
import { KeyBinding } from '@codemirror/view'

export const strikeKeymap: KeyBinding = {
  linux: 'Shift-Ctrl-s',
  win: 'Shift-Ctrl-s',
  mac: 'Shift-Meta-s',
  run: (view) => {
    execute(view)
    return true
  },
  preventDefault: true,
}

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
      changes: {
        from: selection.main.from,
        insert: '~~텍스트~~',
      },
      selection: { anchor: selection.main.from, head: selection.main.from + 7 },
    }
  } else {
    const strikePattern = /^~~(.*)~~$/
    let newText

    if (strikePattern.test(selectedText)) {
      newText = selectedText.replace(/^~~|~~$/g, '')
    } else {
      newText = `~~${selectedText}~~`
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

export default strike
