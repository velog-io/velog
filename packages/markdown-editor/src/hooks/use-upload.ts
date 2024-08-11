import { uploadImage, type UploadImageArgs } from '@/api/routes/files'
import { useState } from 'react'

export function useUpload() {
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<string | null>(null)

  const upload = async (args: UploadImageArgs) => {
    setLoading(true)
    const data = await uploadImage(args)
    setImage(data.path)
    setLoading(false)
    return data.path
  }

  return {
    image,
    setImage,
    upload,
    loading,
  }
}
