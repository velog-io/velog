import { useState } from 'react'

import { UploadImageArgs, uploadImage } from '@/lib/api/files'

export function useCFUpload() {
  const [image, setImage] = useState<string | null>(null)

  const upload = async (args: UploadImageArgs) => {
    const data = await uploadImage(args)
    setImage(data.path)
    return data.path
  }

  return {
    image,
    upload,
  }
}
