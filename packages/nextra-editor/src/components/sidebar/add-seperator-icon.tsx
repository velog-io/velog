import { SeparatorIcon } from '../../nextra/icons/seperator'

type Props = {
  className: string
}

const AddSeperatorIcon = ({ className }: Props) => {
  return (
    <span className={className}>
      <SeparatorIcon />
    </span>
  )
}

export default AddSeperatorIcon
