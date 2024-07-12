import { EditorView, KeyBinding } from '@codemirror/view'
import { ToolbarCommand } from './type'
import { CustomEventDetail } from '@/types'
import { markdownCustomEventName } from '@/index'

export const saveKeymap: KeyBinding = {
  linux: 'Ctrl-s',
  win: 'Ctrl-s',
  mac: 'Meta-s',
  run: (view) => {
    saveExecute(view)
    return true
  },
  preventDefault: true,
}

const save: ToolbarCommand = {
  name: 'save',
  keyCommand: 'save',
  button: { 'aria-label': 'Save' },
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
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </svg>
  ),
  execute: saveExecute,
}

const prevDoc: Map<string, string> = new Map()

export function saveExecute(view: EditorView) {
  const doc = view.state.doc.toString()

  const currentUrl = window.location.href
  if (prevDoc.has(currentUrl) && prevDoc.get(currentUrl) === doc) {
    return
  }

  prevDoc.set(currentUrl, doc)
  console.log('save!')
  const event = new CustomEvent<CustomEventDetail['updateItemEvent']>(
    markdownCustomEventName.updateItemEvent,
    {
      detail: { body: doc },
    },
  )
  window.dispatchEvent(event)
}

export default save
