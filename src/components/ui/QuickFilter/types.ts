export type QuickFilterOption = {
  label: React.ReactNode
  value: string
  field: string
}

export type QuickFilterProps = {
  value: any
  options: QuickFilterOption[]
  onChange?: (value: any) => void
}
