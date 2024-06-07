import { TransactionSpec } from '@codemirror/state'
import { ToolbarCommand } from './type'
import { EditorView } from 'codemirror'
import { KeyBinding } from '@codemirror/view'

export const codeKeymap: KeyBinding = {
  linux: 'Shift-Ctrl-c',
  win: 'Shift-Ctrl-c',
  mac: 'Shift-Meta-c',
  run: (view) => {
    execute(view)
    return true
  },
}

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
  execute,
  keymap: codeKeymap,
}

export function execute(view: EditorView | null) {
  if (!view) return
  const { state, dispatch } = view
  const selection = state.selection
  const selectedText = state.doc.sliceString(selection.main.from, selection.main.to)

  let transaction

  if (selectedText.length === 0) {
    transaction = state.update({
      changes: { from: selection.main.from, insert: '```\n코드를 입력하세요\n```' },
      selection: { anchor: selection.main.from + 4, head: selection.main.from + 13 },
    })
  } else {
    const codeBlockRegex = /^```[\s\S]*```$/
    let newText

    if (codeBlockRegex.test(selectedText)) {
      newText = selectedText.replace(/^```\n|\n```$/g, '')
    } else {
      newText = `\`\`\`\n${selectedText}\n\`\`\``
    }

    const transactionSpec: TransactionSpec = {
      changes: { from: selection.main.from, to: selection.main.to, insert: newText },
    }

    transaction = state.update(transactionSpec)
  }
  dispatch(transaction)
}

export default code
