import { Entity } from '@/enums/entity'

export type AdvanceSelectProps = {
  allowClear?: boolean
  baseFilters?: any
  disabled?: boolean
  value?: any
  /** lodash template over each row, e.g. '${ first_name } ${ last_name }' */
  labelFormat: string
  /** lodash template over each row, e.g. '${ user_id }' */
  valueFormat: string
  plain?: boolean
  placeholder?: string
  mode?: 'single' | 'multiple' | 'tags'
  entity: Entity | string
  onBlur?: () => void
  onChange?: (value?: any) => void
}
