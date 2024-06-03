import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import React, { ReactElement } from 'react'

type EditorRef = {
  container?: HTMLDivElement | HTMLElement | null
  state: EditorState | null
  view: EditorView | null
}

export type ToolbarCommand = {
  name: string
  icon: ReactElement | React.RefAttributes<SVGSVGElement>
  keyCommand?: string
  button?: React.ButtonHTMLAttributes<HTMLButtonElement>
  execute(editorRef: EditorRef): void
}
