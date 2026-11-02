export type RadioOptionProps = {
  label: React.ReactNode
  value: string
}

export type RadioGroupProps = {
  /** default: segmented buttons, normal: classic radio dots */
  mode?: 'normal' | 'default'
  disabled?: boolean
  value?: string
  options: RadioOptionProps[]
  onChange?: (value: any) => void
}
