import * as React from 'react'
import type { SVGProps } from 'react'
const SvgLikeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="m18 1-6 4-6-4-6 5v7l12 10 12-10V6z" />
  </svg>
)
export default SvgLikeIcon
