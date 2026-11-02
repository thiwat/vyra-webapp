import { useState } from 'react'
import { getBase64FromFile } from '@/utils/file'
import { UploadHookProps } from './types'

/** Drag & drop / file input -> base64 value for the Upload control. */
const useUpload = ({ accept, path, onBlur, onChange }: UploadHookProps) => {
  const [dragOver, setDragOver] = useState<boolean>(false)

  const preventEvent = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  const onDragOver = e => {
    preventEvent(e)
    setDragOver(true)
  }

  const onDragLeave = e => {
    preventEvent(e)
    setDragOver(false)
  }

  const onDrop = async e => {
    preventEvent(e)
    setDragOver(false)
    const file: File = e.dataTransfer?.files?.[0] || e.target?.files?.[0]
    if (e.target?.value) e.target.value = ''
    if (!file) return

    if (accept && accept.length > 0 && !accept.includes(file.type)) return

    const imageData = await getBase64FromFile(file)

    onChange?.({
      file_name: file.name,
      size: file.size,
      file,
      path,
      image_data: imageData,
      file_type: file.type
    })

    onBlur && onBlur()
  }

  return {
    dragOver,
    onDrop,
    preventEvent,
    onDragOver,
    onDragLeave
  }
}

export default useUpload
