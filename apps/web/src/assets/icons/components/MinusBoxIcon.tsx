import * as React from 'react'
import type { SVGProps } from 'react'
const SvgMinusBoxIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 12" {...props}>
    <path fill="currentColor" d="M9.5 6.5v-1h-7v1h7z" />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M0 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm1 0h10v10H1V1z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgMinusBoxIcon
