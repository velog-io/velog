declare module '@theguild/remark-mermaid' {
  import { Pluggable } from 'unified'
  const remarkMermaid: Pluggable
  export { remarkMermaid }

  import { ReactElement } from 'react'
  declare function Mermaid({ chart }: { chart: string }): ReactElement
  export { Mermaid }
}

declare module '@theguild/remark-mermaid/mermaid' {
  const mermaid: any
  export { mermaid }
}
