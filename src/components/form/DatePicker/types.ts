export type DatePickerProps = {
  id?: string
  /**
   * mode `date`: 'DD/MM/YYYY' string, `datetime`: Date, `time`: 'HH:mm' string
   */
  value?: any
  min?: Date | string
  max?: Date | string
  disabled?: boolean
  placeholder?: string
  /** time/datetime modes */
  disabledHours?: number[]
  minuteStep?: 1 | 5 | 10 | 15 | 30
  mode?: 'date' | 'datetime' | 'time'
  onBlur?: () => void
  onChange?: (value: any) => void
}
