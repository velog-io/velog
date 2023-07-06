import * as React from 'react'
import type { SVGProps } from 'react'
const SvgEmptyThumbnail = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={180}
    height={180}
    fill="none"
    {...props}
  >
    <path fill="#F1F3F5" d="M0 0h180v180H0z" />
    <path
      fill="#CED4DA"
      d="M69 79.5c0-2.484 2.016-4.5 4.5-4.5s4.5 2.016 4.5 4.5a4.5 4.5 0 1 1-9 0ZM96 81l-7.557 12L81 87.12 69 105h42L96 81Zm24-12v42H60V69h60Zm6-6H54v54h72V63Z"
    />
  </svg>
)
export default SvgEmptyThumbnail
