import * as React from 'react'
import type { SVGProps } from 'react'
const SvgImageSeries = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={48}
    fill="currentColor"
    {...props}
  >
    <path d="M32 0H0v48h.163l16-16L32 47.836V0z" />
  </svg>
)
export default SvgImageSeries
