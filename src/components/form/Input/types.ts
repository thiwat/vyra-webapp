export type InputProps = {
  inputRef?: React.Ref<HTMLInputElement>
  id?: string
  value?: any
  tabIndex?: number
  placeholder?: string
  type?: 'password' | 'number' | 'default' | 'email' | 'tel'
  min?: number
  allowDecimal?: boolean
  max?: number
  step?: number
  disabled?: boolean
  /** Enter moves focus to the next input (default true) */
  autoFocus?: boolean
  small?: boolean
  maxLength?: number
  autoComplete?: string
  normalize?: (value: string) => any
  onBlur?: () => void
  onChange?: (value: any) => void
  onKeyDown?: (key: number, value: any, event?: any) => void
}
