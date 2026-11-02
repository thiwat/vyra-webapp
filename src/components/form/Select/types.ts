export type SelectOptionProps = {
  label: React.ReactNode
  value?: any
  isDisabled?: boolean
  /** grouped options */
  options?: SelectOptionProps[]
}

export type SelectProps = {
  id?: string
  disabled?: boolean
  value?: any
  options?: SelectOptionProps[]
  /** single (default) | multiple (value: any[]) | tags (free text, value: string[]) */
  mode?: 'single' | 'multiple' | 'tags'
  plain?: boolean
  placeholder?: string
  allowClear?: boolean
  loading?: boolean
  /** Show the current value as an option even if it is not in `options` */
  autoCreateOption?: boolean
  customComponent?: (props: any) => React.ReactNode
  onBlur?: () => void
  onChange?: (value: any) => void
  /** tags mode: return false to reject a typed value */
  onValidateOption?: (value: any) => boolean
  /** menu scrolled to the bottom (load next page) */
  onEndReached?: () => void
  onMenuOpen?: () => void
  onMenuClose?: () => void
}
