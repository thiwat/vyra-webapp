export type StatProps = {
  label: string
  value: React.ReactNode
  valueClassName?: string
  /** 0-100. Omit to hide the meter. */
  meter?: number
  sub?: string
}
