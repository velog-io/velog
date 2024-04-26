import { useMDXComponents as originalUseMDXComponents } from '@mdx-js/react'
import type { Components } from '@mdx-js/react/lib'
import image, { type ImageProps } from 'next/image.js'
import { createElement } from 'react'

const Image = image.default

const DEFAULT_COMPONENTS = {
  img: (props) => createElement(typeof props.src === 'object' ? Image : 'img', props as ImageProps),
} satisfies Components

export const useMDXComponents: typeof originalUseMDXComponents = (components) => {
  return originalUseMDXComponents({
    ...DEFAULT_COMPONENTS,
    ...components,
  })
}

export { MDXProvider } from '@mdx-js/react'

export type { Components }
