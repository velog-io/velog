import { getDefaultExtensions } from './../lib/getDefaultExtensions'
import { Annotation, EditorState, Extension } from '@codemirror/state'
import { EditorView, ViewUpdate } from '@codemirror/view'
import { useTheme } from 'next-themes'
import { RefObject, useEffect, useState } from 'react'
import { useMarkdownEditor } from '../../../contexts/markdown-editor'
import { getEditorStat } from '../lib/getEditorStat'
import { hyperLink } from '@uiw/codemirror-extensions-hyper-link'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { handlePaste } from '../events/paste'
import { useUpload } from '@/hooks/use-upload'
import { handleDrop } from '../events/drop'

type Config = {
  autoFocus?: boolean
  height?: string | null
  minHeight?: string | null
  maxHeight?: string | null
  width?: string | null
  minWidth?: string | null
  maxWidth?: string | null
  extension?: Extension[]
}

const External = Annotation.define<boolean>()

export const useCodemirror = (container: RefObject<HTMLDivElement>, config: Config = {}) => {
  const { theme: currentTheme } = useTheme()
  const { value, setValue, setStat } = useMarkdownEditor()
  const [state, setState] = useState<EditorState | null>(null)
  const [view, setView] = useState<EditorView | null>(null)
  const { upload } = useUpload()
  const {
    autoFocus = true,
    height = null,
    minHeight = null,
    maxHeight = null,
    width = null,
    minWidth = null,
    maxWidth = null,
    extension = [],
  } = config

  const eventHandlers = EditorView.domEventHandlers({
    paste: (event, view) => handlePaste(event, view, upload),
    drop: (event, view) => handleDrop(event, view, upload),
  })

  const defaultThemeOption = EditorView.theme({
    '&': {
      outline: 'none !important',
      height,
      minHeight,
      maxHeight,
      width,
      minWidth,
      maxWidth,
    },
    '& .cm-editor': {
      height: '100%',
    },
    '& .cm-scroller': {
      width: '100%',
      height: '100% !important',
      scrollbarWidth: 'thin',
      scrollbarColor: 'oklch(55.55% 0 0 / 40%) transparent',
      scrollbarGutter: 'stable',
      'overflow-x': 'hidden',
    },
    '.cm-heading1': { fontSize: '24px' },
    '.cm-heading2': { fontSize: '20px' },
    '.cm-heading3': { fontSize: '18px' },
    '.cm-heading4': { fontSize: '16px' },
    '.cm-heading5': { fontSize: '14px' },
  })

  const updateListener = EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
    if (viewUpdate.docChanged) {
      const doc = viewUpdate.state.doc
      const value = doc.toString()
      setValue(value, viewUpdate)
      setStat(getEditorStat(viewUpdate))
    }
  })

  const defaultExtensions = getDefaultExtensions({
    theme: currentTheme === 'dark' ? 'dark' : 'light',
    readOnly: false,
    editable: true,
    placeholder: '당신의 이야기를 적어주세요...',
    indentWithTab: true,
    basicSetup: true,
  })

  const extenstions = [
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    hyperLink,
    updateListener,
    defaultThemeOption,
    eventHandlers,
    ...defaultExtensions,
    ...extension,
  ]

  // create state
  useEffect(() => {
    if (container?.current && !state) {
      const stateCurrent = EditorState.create({
        doc: value,
        extensions: extenstions,
      })
      setState(stateCurrent)
    }
  }, [container, state, value, extenstions])

  // create view
  useEffect(() => {
    if (container?.current && state && !view) {
      const viewCurrent = new EditorView({
        state,
        parent: container.current,
      })

      setView(viewCurrent)
    }

    return () => {
      if (!view) return
      view.destroy()
      setView(null)
    }
  }, [container, state, view])

  // destroy view
  useEffect(
    () => () => {
      if (!view) return
      view.destroy()
      setView(null)
    },
    [view],
  )

  useEffect(() => {
    if (!view) return
    if (!autoFocus) return
    view.focus()
  }, [autoFocus, view])

  useEffect(() => {
    if (!view) return
    // view.dispatch({ effects: StateEffect.reconfigure.of(extenstions) })
  }, [container, config, extenstions])

  useEffect(() => {
    if (typeof value !== 'string') return
    const currentValue = view ? view.state.doc.toString() : ''
    if (view && value !== currentValue) {
      view.dispatch({
        changes: { from: 0, to: currentValue.length, insert: value || '' },
        annotations: [External.of(true)],
      })
    }
  }, [value, view])

  return { state, setState, view, setView, value }
}
