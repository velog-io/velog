import { EditorState, Extension } from '@codemirror/state'
import { EditorView, keymap, placeholder } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { darkTheme, lightTheme } from './theme'
import { basicSetup, type BasicSetupOptions } from '@uiw/codemirror-extensions-basic-setup'
import { codeKeymap } from '../toolbar/commands/code'

export type ExtensionOptions = {
  indentWithTab?: boolean
  basicSetup?: boolean | BasicSetupOptions
  placeholder?: string | HTMLElement
  theme?: 'light' | 'dark' | 'none' | Extension
  readOnly?: boolean
  editable?: boolean
}

export const getDefaultExtensions = (options: ExtensionOptions) => {
  const {
    indentWithTab: defaultIndentWithTab = true,
    editable = true,
    readOnly = false,
    theme = 'light',
    placeholder: placeholderStr = '',
    basicSetup: defaultBasicSetup = true,
  } = options

  const getExtensions: Extension[] = []

  if (defaultIndentWithTab) {
    getExtensions.unshift(keymap.of([indentWithTab, codeKeymap]))
  }

  if (defaultBasicSetup) {
    if (typeof defaultBasicSetup === 'boolean') {
      getExtensions.unshift(basicSetup())
    } else {
      getExtensions.unshift(basicSetup(defaultBasicSetup))
    }
  }

  if (placeholderStr) {
    getExtensions.unshift(placeholder(placeholderStr))
  }

  switch (theme) {
    case 'light':
      getExtensions.push(lightTheme.quietlight)
      break
    case 'dark':
      getExtensions.push(darkTheme.material)
      break
    case 'none':
      break
  }

  if (editable === false) {
    getExtensions.push(EditorView.editable.of(false))
  }

  if (readOnly) {
    getExtensions.push(EditorState.readOnly.of(true))
  }

  return [...getExtensions]
}
