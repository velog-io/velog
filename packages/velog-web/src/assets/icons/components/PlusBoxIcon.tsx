import * as React from 'react'
import type { SVGProps } from 'react'
const SvgPlusBoxIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <path fill="currentColor" d="M5.5 2.5h1v3h3v1h-3v3h-1v-3h-3v-1h3v-3z" />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M1 0a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1zm10 1H1v10h10V1z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgPlusBoxIcon
