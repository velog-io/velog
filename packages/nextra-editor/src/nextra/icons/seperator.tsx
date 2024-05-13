// import { ComponentProps, ReactElement } from 'react'

// export function SeparatorIcon(props: ComponentProps<'svg'>): ReactElement {
//   return (
//     <svg
//       width="16"
//       height="16"
//       viewBox="0 0 24 24"
//       xmlns="http://www.w3.org/2000/svg"
//       fill="currentColor"
//       {...props}
//     >
//       <path d="M3 13H1v-2h2zm4-2H5v2h2zm12 0h-2v2h2zm4 0h-2v2h2zm-12 0H9v2h2zm4 0h-2v2h2z" />
//       <path fill="none" d="M0 0h24v24H0z" />
//     </svg>
//   )
// }

import type { SVGProps } from 'react'

export function SeparatorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" {...props}>
      <path fill="currentColor" d="M14 8v1H3V8z"></path>
    </svg>
  )
}
