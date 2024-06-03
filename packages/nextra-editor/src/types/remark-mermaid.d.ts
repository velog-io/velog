declare module '@theguild/remark-mermaid' {
  import { Pluggable } from 'unified'
  const remarkMermaid: Pluggable
  export { remarkMermaid }

  import { ReactElement } from 'react'
  declare function Mermaid({ chart }: { chart: string }): ReactElement
  export { Mermaid }
}

declare module '@theguild/remark-mermaid/mermaid' {
  // `mermaid` 모듈의 타입 선언을 여기에 추가하세요.
  // 예를 들어, `mermaid` 모듈이 `any` 타입의 값을 export한다고 가정하면, 다음과 같이 선언할 수 있습니다:
  const mermaid: any
  export { mermaid }
}
