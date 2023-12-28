import { useCallback, useState } from 'react'

import { uploadImage } from '@/lib/api/files'
import useJazzbar from '@/components/Jazzbar/hooks/useJazzbar'

export function useCFUpload() {
  const [setProgress] = useJazzbar()
  const [image, setImage] = useState<string | null>(null)

  const upload = useCallback(
    async (file: File, info: { type: 'post' | 'profile'; refId?: string }) => {
      const data = await uploadImage({ file, info, onUploadProgress: setProgress })
      setImage(data.path)
      return data.path
    },
    [setProgress],
  )

  return {
    image,
    upload,
  }
}
