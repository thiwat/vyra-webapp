export type SegmentedOption = {
  label: React.ReactNode
  value: string
  /** Applied while this option is selected. */
  activeClassName?: string
}

export type SegmentedProps = {
  id?: string
  value?: string
  options: SegmentedOption[]
  disabled?: boolean
  small?: boolean
  onChange?: (value: string) => void
}
