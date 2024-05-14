import { CollapseAllIcon as Icon } from '../../nextra/icons/collapse-all'

type Props = {
  className: string
}

const CollapseAllIcon = ({ className }: Props) => {
  return (
    <span className={className}>
      <Icon />
    </span>
  )
}

export default CollapseAllIcon
