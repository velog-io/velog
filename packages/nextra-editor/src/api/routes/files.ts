import { AxiosProgressEvent } from 'axios'
import apiClient from '../apiClient'

export interface PreuploadInfo {
  image_path: string
  signed_url: string
}

export async function uploadImage({ file, info, onUploadProgress }: UploadImageArgs) {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('type', info.type)
  if (info.refId) {
    formData.append('ref_id', info.refId)
  }
  const response = await apiClient.post<{ path: string }>('/api/files/v3/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  })

  return response.data
}

export type UploadImageArgs = {
  file: File
  info: { type: 'post' | 'profile'; refId?: string }
  onUploadProgress?: (event: AxiosProgressEvent) => void
}
