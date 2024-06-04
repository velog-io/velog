import { uploadImage, type UploadImageArgs } from '@/api/routes/files'
import { useState } from 'react'

export function useUpload() {
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
