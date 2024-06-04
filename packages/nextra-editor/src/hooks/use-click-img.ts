import { useCallback, useState } from 'react'

export default function useClickImage() {
  const [file, setFile] = useState<File | null>(null)

  const onClick = useCallback(() => {
    const promise = new Promise<File | null>((resolve, reject) => {
      const input = document.createElement('input')
      input.accept = 'image/*'

      const timeout: NodeJS.Timeout = setTimeout(reject, 1000 * 60 * 3)
      input.type = 'file'
      input.onchange = () => {
        clearTimeout(timeout)
        if (!input.files) return reject()
        const file = input.files[0]
        setFile(file)
        resolve(file)
      }
      input.click()
    })
    return promise
  }, [])

  return [onClick, file] as [typeof onClick, typeof file]
}
