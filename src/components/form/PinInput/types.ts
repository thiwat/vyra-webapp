export type PinInputProps = {
  value?: string
  /** number of boxes (default 6) */
  length?: number
  /** numeric (default): digits only, custom: any character */
  type?: 'numeric' | 'custom'
  /** mask the characters */
  secret?: boolean
  disabled?: boolean
  /** submit the surrounding Form when all boxes are filled (default true) */
  autoSubmit?: boolean
  onChange?: (value: string) => void
}
