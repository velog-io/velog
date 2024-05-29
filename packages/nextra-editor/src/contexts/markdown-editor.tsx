import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { mdxCompiler } from '../mdx-compiler'

type MarkdownEditorContext = {
  value: string
  setValue: (value: string) => void
  mdxSource: MDXRemoteSerializeResult | null
  setMdxSource: (value: MDXRemoteSerializeResult | null) => void
}

const MarkdownEditorConext = createContext<MarkdownEditorContext>({
  value: '',
  setValue: () => {},
  mdxSource: null,
  setMdxSource: () => {},
})

export function useMarkdownEditor() {
  return useContext(MarkdownEditorConext)
}

type Props = {
  children: React.ReactNode
  value: {
    editorValue: string
  }
}

export const MarkdownEditorProvider = ({ children, value: { editorValue } }: Props) => {
  const [value, setValue] = useState<string>(editorValue)
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)

  useEffect(() => {
    async function compileSource() {
      try {
        const result = await mdxCompiler(value, {
          onigHostUrl: process.env.NEXT_PUBLIC_CLIENT_HOST,
        })
        setMdxSource(result)
      } catch (error) {
        console.log('failed mdx compile: ', error)
      }
    }

    compileSource()
  }, [value])

  const context: MarkdownEditorContext = {
    value,
    setValue,
    mdxSource,
    setMdxSource,
  }

  return <MarkdownEditorConext.Provider value={context}>{children}</MarkdownEditorConext.Provider>
}
