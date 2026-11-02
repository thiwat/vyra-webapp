import { UploadValue } from '@/hooks/upload/types'

export type UploadProps = {
  /** used as the hidden <input type=file> id */
  name?: string
  id?: string
  /** UploadValue (base64) for a new file, or `{ url }` for an existing one */
  value?: Partial<UploadValue>
  path?: string
  disabled?: boolean
  /** allowed MIME types */
  accept?: string[]
  description?: string
  /** show file name/size instead of an image preview */
  isFile?: boolean
  onBlur?: () => void
  onChange?: (value: UploadValue | undefined) => void
}
