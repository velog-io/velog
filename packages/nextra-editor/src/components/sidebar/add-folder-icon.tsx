import { NewFolderIcon } from '../../nextra/icons/new-folder'

type Props = {
  className: string
}

const AddFolderIcon = ({ className }: Props) => {
  return (
    <span className={className}>
      <NewFolderIcon />
    </span>
  )
}

export default AddFolderIcon
