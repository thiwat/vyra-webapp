export type UploadValue = {
  file_name: string
  size: number
  file: File
  path?: string
  /** base64 data URL */
  image_data: string
  file_type: string
  /** already-uploaded file */
  url?: string
}

export type UploadHookProps = {
  /** allowed MIME types, e.g. ['image/png', 'image/jpeg'] */
  accept?: string[]
  path?: string
  onBlur?: () => void
  onChange?: (value: UploadValue) => void
}
