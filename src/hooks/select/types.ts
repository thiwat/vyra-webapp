import { Entity } from '@/enums/entity'

export type SelectHookProps = {
  /** lodash template, e.g. '${ first_name } ${ last_name }' */
  labelFormat?: string
  /** lodash template, e.g. '${ code }' */
  valueFormat?: string
  entity: Entity | string
  baseFilters?: any
}
